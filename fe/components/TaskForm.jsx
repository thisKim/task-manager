"use client";

import { useTasks } from "@/app/providers";
import {
  Button,
  Dialog,
  Flex,
  Select,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";

export default function TaskForm(props) {
  const { tasks, setTasks } = useTasks();

  const [task, setTask] = useState({});

  useEffect(() => {
    setTask(props.task);
  }, [props.task]);

  const handleInput = (event) => {
    const newTask = { ...task, [event.target.name]: event.target.value };
    setTask(newTask);
  };

  const handleStatus = (event) => {
    setTask({ ...task, status: event });
  };

  const handleCreate = async () => {
    const response = await fetch("http://localhost:8080/api/tasks", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(task),
    });

    const newTask = await response.json();

    setTasks([...tasks, newTask]);
    setTask({});
  };

  const handleUpdate = async () => {
    const response = await fetch(
      `http://localhost:8080/api/tasks/${props.task.id}`,
      {
        method: "PUT",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(task),
      }
    );
    const updatedTask = await response.json();
    const newTasks = tasks.map((newTask) => {
      if (newTask.id === updatedTask.id) {
        return updatedTask;
      } else {
        return newTask;
      }
    });

    setTasks(newTasks);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>{props.task?.id ? "Edit" : "Add"} Task</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>{props.task?.id ? "Edit" : "Add"} Task</Dialog.Title>
        <Dialog.Description size="2"></Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Title (Required)
            </Text>
            <TextField.Root
              name="title"
              defaultValue={task?.title}
              onChange={handleInput}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Description
            </Text>
            <TextArea
              name="description"
              defaultValue={task?.description}
              onChange={handleInput}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Status
            </Text>
            <Select.Root
              defaultValue={"pending"}
              value={task?.status ?? "pending"}
              onValueChange={handleStatus}
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Group>
                  <Select.Item value="pending">Pending</Select.Item>
                  <Select.Item value="completed">Completed</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button
              onClick={props.task?.id ? handleUpdate : handleCreate}
              disabled={!task?.title}
            >
              Save
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
