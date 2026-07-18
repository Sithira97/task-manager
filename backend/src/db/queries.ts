export const fetchTaskById = (isAdmin?: boolean): string => {
  return `SELECT t.id,
        t.title, t.description, t.priority, t.status, t.due_date, t.created_at, t.updated_at, t.deleted_at,
        IF(u1.id IS NULL, NULL, JSON_OBJECT(
            'user_id', u1.id,
            'username', u1.username,
            'email', u1.email${isAdmin ? ", 'role', u1.role" : ""}
        )) AS created_by,
        IF(COUNT(a.user_id) = 0, JSON_ARRAY(), JSON_ARRAYAGG(
            JSON_OBJECT(
                'user_id', u2.id,
                'username', u2.username,
                'email', u2.email${isAdmin ? ", 'role', u2.role" : ""}
            )
        )) AS assignees
      FROM
        tasks t
      LEFT JOIN users u1 ON
        t.created_by = u1.id
      LEFT JOIN assignees a ON
        t.id = a.task_id
      LEFT JOIN users u2 ON
        a.user_id = u2.id
      WHERE t.id = ? ${isAdmin ? "" : "AND t.deleted_at IS NULL"} GROUP BY t.id`;
};

export const fetchTasks = (isAdmin?: boolean, userId?: number): string => {
  let query = `SELECT t.id,
        t.title, t.description, t.priority, t.status, t.due_date, t.created_at, t.updated_at, t.deleted_at,
        IF(u1.id IS NULL, NULL, JSON_OBJECT(
            'user_id', u1.id,
            'username', u1.username,
            'email', u1.email
            ${isAdmin ? ", 'role', u1.role" : ""}
        )) AS created_by,
        IF(COUNT(a.user_id) = 0, JSON_ARRAY(), JSON_ARRAYAGG(
            JSON_OBJECT(
                'user_id', u2.id,
                'username', u2.username,
                'email', u2.email
                ${isAdmin ? ", 'role', u2.role" : ""}
            )
        )) AS assignees
      FROM
        tasks t
      LEFT JOIN users u1 ON
        t.created_by = u1.id
      LEFT JOIN assignees a ON
        t.id = a.task_id
      LEFT JOIN users u2 ON
        a.user_id = u2.id`;

  if (!isAdmin && userId !== undefined) {
    query += ` WHERE t.deleted_at IS NULL`;
  }

  return query;
};

export const fetchTeams = (isAdmin?: boolean): string => {
  return `SELECT t.id,
        t.title, t.description, t.deleted_at,
        IF(u1.id IS NULL, NULL, JSON_OBJECT(
            'user_id', u1.id,
            'username', u1.username,
            'email', u1.email
            ${isAdmin ? ", 'role', u1.role" : ""}
        )) AS team_lead,
        IF(COUNT(a.user_id) = 0, JSON_ARRAY(), JSON_ARRAYAGG(
            JSON_OBJECT(
                'user_id', u2.id,
                'username', u2.username,
                'email', u2.email
                ${isAdmin ? ", 'role', u2.role" : ""}
            )
        )) AS team_members
      FROM
        tasks t
      LEFT JOIN users u1 ON
        t.created_by = u1.id
      LEFT JOIN assignees a ON
        t.id = a.task_id
      LEFT JOIN users u2 ON
        a.user_id = u2.id ${isAdmin ? "" : `WHERE t.deleted_at IS NULL`} GROUP BY t.id ${isAdmin ? "" : `HAVING (MAX(t.created_by = ?) = 1 OR MAX(a.user_id = ?) = 1)`}`;
};

export const fetchTeam = (
  isAdmin?: boolean,
): string => {
  return `SELECT t.id,
        t.title, t.description, t.deleted_at,
        IF(u1.id IS NULL, NULL, JSON_OBJECT(
            'user_id', u1.id,
            'username', u1.username,
            'email', u1.email
            ${isAdmin ? ", 'role', u1.role" : ""}
        )) AS team_lead,
        IF(COUNT(a.user_id) = 0, JSON_ARRAY(), JSON_ARRAYAGG(
            JSON_OBJECT(
                'user_id', u2.id,
                'username', u2.username,
                'email', u2.email
                ${isAdmin ? ", 'role', u2.role" : ""}
            )
        )) AS team_members
      FROM
        tasks t
      LEFT JOIN users u1 ON
        t.created_by = u1.id
      LEFT JOIN assignees a ON
        t.id = a.task_id
      LEFT JOIN users u2 ON
        a.user_id = u2.id WHERE ? = t.id ${isAdmin ? "" : `AND t.deleted_at IS NULL`} GROUP BY t.id ${isAdmin ? "" : `HAVING (MAX(t.created_by = ?) = 1 OR MAX(a.user_id = ?) = 1)`}`;
};

export const fetchUsersWorkWithAdmin = (isAdmin?: boolean) => {
  return `SELECT u1.id, u1.username, u1.email , u1.role,
        COALESCE(JSON_ARRAYAGG(CASE
                WHEN t.id IS NOT NULL THEN 
            JSON_OBJECT(
                "id", t.id,
                "title", t.title,
                "description", t.description,
                "priority", t.priority,
                "status", t.status,
                "due_date", t.due_date,
                "created_at", t.created_at,
                "updated_at", t.updated_at,
                "deleted_at", t.deleted_at,
                'assignees', COALESCE(ta.assignees, JSON_ARRAY())
                )
            END
        ), JSON_ARRAY()
    ) AS tasks
      FROM users u1
      LEFT JOIN tasks t
        ON t.created_by = u1.id
      LEFT JOIN (
        SELECT a.task_id,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    "user_id", u2.id,
                    "username", u2.username,
                    "email", u2.email
                    ${isAdmin ? ", 'role', u2.role" : ""}
                )
            ) AS assignees
        FROM assignees a
        JOIN users u2 ON 
            a.user_id = u2.id
       GROUP BY a.task_id
) ta
    ON ta.task_id = t.id WHERE t.deleted_at IS NULL ${isAdmin ? "" : `AND u1.id = ?`} GROUP BY
        u1.id,
        u1.username,
        u1.email,
        u1.role;
`;
};

export const fetchUsersWorkForAdmin = (isAdmin?: boolean) => {
  return `SELECT u1.id, u1.username, u1.email${isAdmin ? " , u1.role" : ""},
        IF(COUNT(a.task_id) = 0, JSON_ARRAY(), JSON_ARRAYAGG(
            JSON_OBJECT(
                "id", t.id,
                "title", t.title,
                "description", t.description,
                "priority", t.priority,
                "status", t.status,
                "due_date", t.due_date,
                "created_at", t.created_at,
                "updated_at", t.updated_at,
                "deleted_at", t.deleted_at))) AS tasks
      FROM
        users u1
      LEFT JOIN assignees a ON
       u1.id =  a.user_id
      LEFT JOIN tasks t ON
        a.task_id = t.id WHERE t.deleted_at IS NULL ${isAdmin ? "" : `AND u1.id = ?`} GROUP BY u1.id`;
};

export const fetchUsersWorkWith = (isAdmin?: boolean) => {
  return `SELECT
            owner.id,
            owner.username,
            owner.email${isAdmin ? ", owner.role" : ""},
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', t.id,
                    'title', t.title,
                    'description', t.description,
                    'status', t.status,
                    'priority', t.priority,
                    'due_date', t.due_date${
                      isAdmin
                        ? `,   
                    'created_at', t.created_at,
                    'updated_at', t.updated_at,
                    'deleted_at', t.deleted_at`
                        : ""
                    }
                )
            ) AS tasks
        FROM assignees me
        JOIN tasks t
            ON t.id = me.task_id
        JOIN users owner
            ON owner.id = t.created_by
            ${
              isAdmin
                ? ""
                : `WHERE me.user_id = ?
            AND owner.id <> ?
            AND t.deleted_at IS NULL`
            }
        GROUP BY owner.id;`;
};

export const fetchUsersWorkFor = (isAdmin?: boolean) => {
  return `SELECT
            u.id,
            u.username,
            u.email${isAdmin ? ", u.role" : ""},
            JSON_ARRAYAGG(
                    JSON_OBJECT(
                    'id', t.id,
                    'title', t.title,
                    'description', t.description,
                    'status', t.status,
                    'priority', t.priority,
                    'due_date', t.due_date${
                      isAdmin
                        ? `,
                    'created_at', t.created_at,
                    'updated_at', t.updated_at,
                    'deleted_at', t.deleted_at`
                        : ""
                    }
                )
            ) AS tasks
        FROM tasks t
        JOIN assignees a
            ON a.task_id = t.id
        JOIN users u
            ON u.id = a.user_id
            ${
              isAdmin
                ? ""
                : `WHERE t.created_by = ?
            AND u.id <> ?
            AND t.deleted_at IS NULL`
            }
        GROUP BY u.id;`;
};
