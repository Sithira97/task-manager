export const fetchTaskById = `SELECT t.id,
        t.title, t.description, t.priority, t.status, t.due_date, t.created_at,
        IF(u1.id IS NULL, NULL, JSON_OBJECT(
            'user_id', u1.id,
            'username', u1.username,
            'email', u1.email,
            'role', u1.role
        )) AS created_by,
        IF(COUNT(a.user_id) = 0, JSON_ARRAY(), JSON_ARRAYAGG(
            JSON_OBJECT(
                'user_id', u2.id,
                'username', u2.username,
                'email', u2.email,
                'role', u2.role
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
      WHERE t.id = ?`;

export const fetchTasks = `SELECT t.id,
        t.title, t.description, t.priority, t.status, t.due_date, t.created_at,
        IF(u1.id IS NULL, NULL, JSON_OBJECT(
            'user_id', u1.id,
            'username', u1.username,
            'email', u1.email,
            'role', u1.role
        )) AS created_by,
        IF(COUNT(a.user_id) = 0, JSON_ARRAY(), JSON_ARRAYAGG(
            JSON_OBJECT(
                'user_id', u2.id,
                'username', u2.username,
                'email', u2.email,
                'role', u2.role
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
      GROUP BY t.id`;
