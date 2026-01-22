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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Category {
  id_category: number;
  name: string;
  parent_id: number | null;
}

interface UpdateCategoryFormProps {
  open: boolean;
  category: Category | null;
  onClose: () => void;
  onUpdated: () => void;
  mapCategory: Category[] | null;
}

interface UpdateCategoryFormState {
  name: string;
  parent_id: string;
  loading: boolean;
}

export default class UpdateDialog extends Component<
  UpdateCategoryFormProps,
  UpdateCategoryFormState
> {
  state: UpdateCategoryFormState = {
    name: "",
    parent_id: "",
    loading: false,
  };

  /* ---------- preload data when open ---------- */
  componentDidUpdate(prevProps: UpdateCategoryFormProps) {
    if (this.props.category && this.props.category !== prevProps.category) {
      this.setState({
        name: this.props.category.name,
        parent_id: this.props.category.parent_id?.toString() ?? "",
      });
    }
  }

  handleUpdateCategory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!this.props.category) return;

    this.setState({ loading: true });

    const payload = {
      name: this.state.name,
      parent_id: this.state.parent_id ? Number(this.state.parent_id) : null,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/category/${this.props.category.id_category}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      this.props.onUpdated();
      this.props.onClose();
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { open, onClose } = this.props;
    const { name, parent_id, loading } = this.state;
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={this.handleUpdateCategory}>
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => this.setState({ name: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="parent_id">Parent Category</Label>

                <Select
                  value={parent_id || undefined}
                  onValueChange={(value) => this.setState({ parent_id: value })}
                >
                  <SelectTrigger id="parent_id" className="w-full">
                    <SelectValue placeholder="No parent (root category)" />
                  </SelectTrigger>

                  <SelectContent>
                    {this.props.mapCategory
                      ?.filter(
                        (cat) =>
                          cat.id_category !== this.props.category?.id_category
                      )
                      .map((cat) => (
                        <SelectItem
                          key={cat.id_category}
                          value={String(cat.id_category)}
                        >
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Update"}
              </Button>

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
