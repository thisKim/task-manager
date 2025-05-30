import { useTasks } from "@/app/providers";
import { AlertDialog, Button, Flex } from "@radix-ui/themes";

export default function TaskDelete({ task }) {
  const { tasks, setTasks } = useTasks();

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:8080/api/tasks/${task.id}`, {
      method: "DELETE",
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    const data = await response.json();

    const newTasks = tasks.filter((task) => task.id !== data.id);
    setTasks(newTasks);
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button color="red">Delete</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Delete Task</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure you want to delete "{task.title}"?
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={handleDelete}>
              Delete
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
