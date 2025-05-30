"use client";

import { useTasks } from "@/app/providers";
import TaskDelete from "@/components/TaskDelete";
import TaskForm from "@/components/TaskForm";
import TaskStatus from "@/components/TaskStatus";
import useFetch from "@/hooks/useFetch";
import { HoverCard, Link, Select, Spinner, Table } from "@radix-ui/themes";
import { Label } from "@radix-ui/themes/components/context-menu";
import { useEffect, useState } from "react";

export default function Tasks() {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("created");

  const { tasks, setTasks } = useTasks();
  const { data, loading, error } = useFetch(
    `http://localhost:8080/api/tasks?filter=${filter}&sort=${sort}`
  );

  useEffect(() => {
    setTasks(data);
  }, [data]);

  const handleFilter = (event) => {
    setFilter(event);
  };

  const handleSort = (event) => {
    setSort(event);
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Unmodified";
    }
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    return formattedDate;
  };

  if (loading) {
    return <Spinner size="3" />;
  }

  return (
    <div>
      <div className="flex gap-3 pb-5">
        <TaskForm />
        <div className="flex gap-3 justify-end ml-auto">
          <div className="flex gap-3">
            <Label>Filter</Label>
            <Select.Root
              defaultValue={filter}
              value={filter}
              onValueChange={handleFilter}
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Group>
                  <Select.Item value="all">All</Select.Item>
                  <Select.Item value="completed">Completed</Select.Item>
                  <Select.Item value="pending">Pending</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>

          <div className="flex gap-3">
            <Label>Sort</Label>
            <Select.Root
              defaultValue={sort}
              value={sort}
              onValueChange={handleSort}
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Group>
                  <Select.Item value="created">Created</Select.Item>
                  <Select.Item value="modified">Modified</Select.Item>
                  <Select.Item value="title">Title</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      </div>

      <Table.Root className="bg-gray-900 rounded-xl">
        <Table.Header>
          <Table.Row align="center">
            <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Created At</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Modified At</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tasks?.map((task) => {
            return (
              <Table.Row
                key={task.id}
                className={task.status === "completed" ? "bg-green-950" : ""}
              >
                <Table.Cell>{task.id}</Table.Cell>
                <Table.Cell>
                  <HoverCard.Root>
                    <HoverCard.Trigger>
                      <Link href="#">{task.title}</Link>
                    </HoverCard.Trigger>
                    <HoverCard.Content maxWidth="300px">
                      {task.description}
                    </HoverCard.Content>
                  </HoverCard.Root>
                </Table.Cell>

                <Table.Cell>
                  <TaskStatus task={task} sort={sort} filter={filter} />
                </Table.Cell>
                <Table.Cell>{formatDate(task.createdAt)}</Table.Cell>
                <Table.Cell>{formatDate(task.modifiedAt)}</Table.Cell>

                <Table.Cell>
                  <div className="flex gap-3 ">
                    <TaskForm task={task} />
                    <TaskDelete task={task} />
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
