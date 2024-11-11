"use client";
import React, { useEffect, useState, useCallback } from "react";
import withAuth from "@/hooks/withAuth";
import { UserRole } from "@/types/user-role";
import { User } from "@/types/user";
import UserTable from "../../../components/admin/dashboard/user-table";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGlobalErrorHandler } from "@/app/context/ErrorMessageProvider";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { ErrorHandler } from "@/utils/errorHandler";

const API_URL = `${process.env.NEXT_PUBLIC_SPRINGBOOT_API_URL}`;

const AdminDashboard: React.FC = () => {
  const { handleError } = useGlobalErrorHandler();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortingField, setSortingField] = useState("username");
  const [order, setOrder] = useState("asc");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchUsers = useCallback(async () => {
    axiosInstance
      .get(
        new URL(
          `/admin/get-users?page=${currentPage}&size=${pageSize}&field=${sortingField}&order=${order}`,
          API_URL
        ).toString()
      )
      .then((response) => {
        setUsers(response.data.content);
        setTotalPages(response.data.totalPages);
        console.log(response.data.content);
      })
      .catch((error: AxiosError) => {
        handleError(error);
      })
      .finally(() => {
        setHasFetched(true);
      });
  }, [currentPage, pageSize, sortingField, order, handleError]);

  useEffect(() => {
    if (!hasFetched) {
      setLoading(true);
      fetchUsers().then(() => {
        setLoading(false);
      });
    }
  }, [fetchUsers, hasFetched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e: React.FormEvent) => {
    setError(null);
    setSuccess(null);

    e.preventDefault();

    axiosInstance
      .post(new URL("/admin", API_URL).toString(), formData)
      .then((response) => {
        if (response.status === 201) {
          setSuccess("Successfully Registered: " + response.data.username);
        }
        setHasFetched(false);
      })
      .catch((error: AxiosError) => {
        const { message } = ErrorHandler.handleError(error);
        setError(message);
      });
  };

  const handleLockUser = useCallback(
    async (user: User, newLockStatus: boolean) => {
      axiosInstance
        .put(new URL(`/admin/lock`, API_URL).toString(), {
          userId: user.userId,
          isLocked: newLockStatus,
        })
        .then((response) => {
          if (response.status === 200) {
            toast({
              variant: "success",
              title: "Success",
              description: `User ${user.username} lock status has been updated to ${newLockStatus ? "locked" : "unlocked"}.`,
            });

            setHasFetched(false);
          }
        })
        .catch((error: AxiosError) => {
          handleError(error);
        });
    },
    [handleError]
  );

  const handlePageChange = (currentPage: number) => {
    setCurrentPage(currentPage);
    setHasFetched(false);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
    setHasFetched(false);
  };

  const handleSort = (sortingField: string) => {
    setSortingField(sortingField);
    setOrder(order === "asc" ? "desc" : "asc");
    setHasFetched(false);
  };

  const handleResetPassword = async (userId: string) => {
    try {
        const response = await axiosInstance.post(
            `${process.env.NEXT_PUBLIC_SPRINGBOOT_API_URL}/admin/reset-admin-password`,
            userId,
        {
          headers: {
            "Content-Type": "text/plain", 
          },
        }
      );
  
      if (response.status === 200) {
        toast({
          variant: "success",
          title: "Success",
          description: "Temporary password has been sent to the admin.",
        });
      }
    } catch (error) {
      handleError(error as AxiosError);
    }
  };
  
  

  return (
    <div className="flex flex-col items-center min-h-screen mt-24">
      <h2 className="text-2xl font-bold my-4">Admin Dashboard</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <UserTable
          users={users}
          onLock={handleLockUser}
          onResetPassword={handleResetPassword} 
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          sortBy={sortingField}
          sortOrder={order}
          onSort={handleSort}
        />
      )}

      <Dialog
        onOpenChange={() => {
          setError(null);
          setSuccess(null);
        }}
      >
        <DialogTrigger asChild>
          <Button variant={"fab"} size={"icon"}>
            <PlusIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleAddUser}>
            <DialogHeader>
              <DialogTitle>Add Admin</DialogTitle>
              <DialogDescription>
                Add a new admin user by filling out the form below. Click save
                when you&apos;re done.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert variant="successful" className="mt-4">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 py-4">
              <div className="grid items-center gap-4">
                <Input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="bg-transparent col-span-3 border-b border-zinc-600 text-white placeholder-zinc-500 transition duration-300"
                />
              </div>

              <div className="grid items-center gap-4">
                <Input
                  id="email"
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-transparent col-span-3 border-b border-zinc-600 text-white placeholder-zinc-500 transition duration-300"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="bg-primary hover:bg-accent text-black hover:text-white transition duration-300"
              >
                Register
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default withAuth(AdminDashboard, {
  requireAuth: true,
  role: UserRole.ADMIN,
});
