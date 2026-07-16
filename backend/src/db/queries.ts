export const fetchTaskById = (id: number, isAdmin?: boolean): string => {
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
      WHERE t.id = ${id} ${isAdmin ? "" : "AND t.deleted_at IS NULL"} GROUP BY t.id`;
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

export const fetchTeams = (id: number, isAdmin?: boolean): string => {
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
        a.user_id = u2.id ${isAdmin ? "" : `WHERE t.deleted_at IS NULL`} GROUP BY t.id ${isAdmin ? "" : `HAVING (MAX(t.created_by = ${id}) = 1 OR MAX(a.user_id = ${id}) = 1)`}`;
};

export const fetchTeam = (
  id: number,
  taskId: number,
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
        a.user_id = u2.id WHERE ${taskId} = t.id ${isAdmin ? "" : `AND t.deleted_at IS NULL`} GROUP BY t.id ${isAdmin ? "" : `HAVING (MAX(t.created_by = ${id}) = 1 OR MAX(a.user_id = ${id}) = 1)`}`;
};
