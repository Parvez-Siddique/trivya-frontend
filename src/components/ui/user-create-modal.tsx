"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  CreateUserPayload,
  LoginUserPayload,
} from "@/app/(public)/customer/action";

interface UserCreateModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  mode: "Create" | "Login";
  setMode: React.Dispatch<React.SetStateAction<"Create" | "Login">>;

  userCreateForm: CreateUserPayload | undefined;
  setUserCreateForm: React.Dispatch<React.SetStateAction<CreateUserPayload>>;

  userLoginForm ? : LoginUserPayload | undefined;
  setUserLoginForm?: React.Dispatch<React.SetStateAction<LoginUserPayload>>;

  onUserCreated?: () => void;
  onCustomerLogin?: () => void;

  handleClose?: () => void;
  singleTab? : boolean;
  singleTabName?: "Create" | "Login";
}

export default function UserCreateModal({
  open,
  setOpen,
  mode,
  setMode,

  userCreateForm,
  setUserCreateForm,

  userLoginForm,
  setUserLoginForm,

  onUserCreated,
  onCustomerLogin,

  handleClose,

  singleTab,

  singleTabName

}: UserCreateModalProps) {
  const [loading, setLoading] = useState(false);

  const isSingleTab = singleTab === true;

  const showRegisterTab = !isSingleTab || singleTabName === "Create";

  const showLoginTab = !isSingleTab || singleTabName === "Login";

  useEffect(() => {

    if (!singleTab || !singleTabName) {
      return;
    }

    const requiredMode = singleTabName === "Create" ? "Create" : "Login";

    if (mode !== requiredMode) {
      setMode(requiredMode);
    }
  }, [singleTab, singleTabName, mode, setMode]);

  // --------------------------------------------------
  // Empty forms
  // --------------------------------------------------

  const emptyCreateForm: CreateUserPayload = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    username: "",
    password: "",
    user_type: "CUSTOMER",
  };

  const emptyLoginForm: LoginUserPayload = {
    username: "",
    password: "",
  };

  // --------------------------------------------------
  // Register form change
  // --------------------------------------------------

  const handleCreateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setUserCreateForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (!setUserLoginForm) {
      return;
    }

    setUserLoginForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleModeChange = (newMode: "Create" | "Login") => {

    if (singleTab) {
      return;
    }
    setMode(newMode);

    // Clear both forms when switching tabs
    setUserCreateForm(emptyCreateForm);
    setUserLoginForm?.(emptyLoginForm);
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (mode === "Create") {
        if (!userCreateForm) {
          return;
        }

        onUserCreated?.();

        return;
      }

      // ----------------------------------------------
      // LOGIN
      // ----------------------------------------------

      if (mode === "Login") {
        if (!userLoginForm) {
          return;
        }

        onCustomerLogin?.();
      }

    } catch (error) {
      console.error(
        mode === "Create"
          ? "Create user error:"
          : "Login error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Close
  // --------------------------------------------------

  const handleDialogClose = () => {
    if (loading) {
      return;
    }

    setOpen(false);

    // Clear both forms
    setUserCreateForm(emptyCreateForm);
    setUserLoginForm?.(emptyLoginForm);

    // Optional parent close handler
    handleClose?.();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          handleDialogClose();
        } else {
          setOpen(true);
        }
      }}
    >
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "Create" ? "Register User" : "Login"}
          </DialogTitle>
        </DialogHeader>

        {!singleTab && (
          <div className="grid grid-cols-2 border-b">

            {/* Register Tab */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleModeChange("Create")}
              className={`
                py-3
                text-sm
                font-medium
                transition-colors
                cursor-pointer
                disabled:cursor-not-allowed
                disabled:opacity-50
                ${
                  mode === "Create"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              Register
            </button>

            {/* Login Tab */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleModeChange("Login")}
              className={`
                py-3
                text-sm
                font-medium
                transition-colors
                cursor-pointer
                disabled:cursor-not-allowed
                disabled:opacity-50
                ${
                  mode === "Login"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              Login
            </button>

          </div>
        )}

        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">

          {/* ================================================= */}
          {/* REGISTER FORM */}
          {/* ================================================= */}

          {mode === "Create" && (
            <div className="grid grid-cols-2 gap-5">

              <div className="space-y-2">
                <Label htmlFor="register-firstName">
                  First Name
                </Label>

                <Input
                  className="h-10"
                  id="register-firstName"
                  name="firstName"
                  type="text"
                  placeholder="Enter first name"
                  value={
                    userCreateForm?.firstName ?? ""
                  }
                  onChange={handleCreateChange}
                  required
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="register-lastName">
                  Last Name
                </Label>

                <Input
                  className="h-10"
                  id="register-lastName"
                  name="lastName"
                  type="text"
                  placeholder="Enter last name"
                  value={
                    userCreateForm?.lastName ?? ""
                  }
                  onChange={handleCreateChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="register-email">
                  Email
                </Label>

                <Input
                  className="h-10"
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="user@example.com"
                  value={
                    userCreateForm?.email ?? ""
                  }
                  onChange={handleCreateChange}
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="register-phoneNumber">
                  Phone Number
                </Label>

                <Input
                  id="register-phoneNumber"
                  className="h-10"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Enter phone number"
                  value={
                    userCreateForm?.phoneNumber ?? ""
                  }
                  onChange={handleCreateChange}
                />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="register-username">
                  Username
                </Label>

                <Input
                  className="h-10"
                  id="register-username"
                  name="username"
                  type="text"
                  placeholder="Enter username"
                  value={
                    userCreateForm?.username ?? ""
                  }
                  onChange={handleCreateChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="register-password">
                  Password
                </Label>

                <Input
                  id="register-password"
                  className="h-10"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={
                    userCreateForm?.password ?? ""
                  }
                  onChange={handleCreateChange}
                  required
                  minLength={8}
                />

                <p className="text-xs text-muted-foreground">
                  Password must contain at least 8 characters.
                </p>
              </div>

            </div>
          )}

          {/* ================================================= */}
          {/* LOGIN FORM */}
          {/* ================================================= */}

          {mode === "Login" && (
            <div className="space-y-5">

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="login-username">
                  Username
                </Label>

                <Input
                  className="h-10"
                  id="login-username"
                  name="username"
                  type="text"
                  placeholder="Enter username"
                  value={
                    userLoginForm?.username ?? ""
                  }
                  onChange={handleLoginChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="login-password">
                  Password
                </Label>

                <Input
                  id="login-password"
                  className="h-10"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={
                    userLoginForm?.password ?? ""
                  }
                  onChange={handleLoginChange}
                  required
                />
              </div>

            </div>
          )}

          {/* ================================================= */}
          {/* FOOTER */}
          {/* ================================================= */}

          <DialogFooter className="pt-3">

            {/* Cancel */}
            <Button
              type="button"
              variant="outline"
              onClick={handleDialogClose}
              disabled={loading}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="
                gap-2
                bg-primary-thick
                text-white
                hover:opacity-90
                cursor-pointer
              "
            >

              {loading && (
                <Loader2
                  className="h-4 w-4 animate-spin"
                />
              )}

              {loading
                ? mode === "Create"
                  ? "Creating..."
                  : "Logging in..."
                : mode === "Create"
                  ? "Register"
                  : "Login"}

            </Button>

          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}