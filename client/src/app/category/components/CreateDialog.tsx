"use client";

import React, { Component, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateCategoryFormProps {
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
}

export default class CreateDialog extends Component<CreateCategoryFormProps> {
  
  handleCreateCategory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    this.setState({ loading: true });
  
    const formData = new FormData(e.currentTarget);
  
    const payload = {
      name: formData.get("name"),
      parent_id: formData.get("parent_id")
        ? Number(formData.get("parent_id"))
        : null,
    };
  
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/category`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );
  
      if (!res.ok) throw new Error("Create failed");
  
      this.props.onCreate?.(); 
      this.props.onClose();
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { open, onClose } = this.props;

    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={this.handleCreateCategory}>
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="parent_id">Parent ID</Label>
                <Input
                  id="parent_id"
                  name="parent_id"
                  type="number"
                  placeholder="Optional"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}
