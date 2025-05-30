import { useTasks } from "@/app/providers";
import { Select } from "@radix-ui/themes";
import { useState } from "react";

function TaskStatus({ task, sort, filter }) {
  const [loading, setLoading] = useState(false);
  const { tasks, setTasks } = useTasks();

  const handleStatus = async (event, task) => {
    setLoading(true);
    const response = await fetch(`http://localhost:8080/api/tasks/${task.id}`, {
      method: "PUT",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ ...task, status: event }),
    });
    const updatedTask = await response.json();

    const res = await fetch(
      `http://localhost:8080/api/tasks?filter=${filter}&sort=${sort}`
    );
    const tasks = await res.json();
    setTasks(tasks);
    setLoading(false);
  };

  return (
    <Select.Root
      defaultValue={task.status ?? "pending"}
      value={task.status}
      onValueChange={(event) => handleStatus(event, task)}
      disabled={loading}
    >
      <Select.Trigger />
      <Select.Content>
        <Select.Group>
          <Select.Item value="pending">Pending</Select.Item>
          <Select.Item value="completed">Completed</Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}

export default TaskStatus;
