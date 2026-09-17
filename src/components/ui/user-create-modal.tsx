
"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {CreateCustomerPayload} from "@/app/(public)/shop-products/action";

import {LoginUserPayload} from "@/app/(public)/customer/action"

interface UserCreateModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  mode: "Create" | "Login";
  setMode: React.Dispatch<React.SetStateAction<"Create" | "Login">>;

  userCreateForm: CreateCustomerPayload | undefined;

  setUserCreateForm: React.Dispatch<
    React.SetStateAction<CreateCustomerPayload>
  >;

  userLoginForm?: LoginUserPayload | undefined;

  setUserLoginForm?: React.Dispatch<
    React.SetStateAction<LoginUserPayload>
  >;

  onOrderPlaced?: () => void | Promise<void>;
  onCustomerLogin?: () => void;

  handleClose?: () => void;

  singleTab?: boolean;
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

  onOrderPlaced,
  onCustomerLogin,

  handleClose,

  singleTab,
  singleTabName,
}: UserCreateModalProps) {
  const [loading, setLoading] = useState(false);

  const isSingleTab = singleTab === true;

  // --------------------------------------------------
  // Single tab handling
  // --------------------------------------------------

  useEffect(() => {
    if (!singleTab || !singleTabName) {
      return;
    }

    const requiredMode =
      singleTabName === "Create"
        ? "Create"
        : "Login";

    if (mode !== requiredMode) {
      setMode(requiredMode);
    }
  }, [
    singleTab,
    singleTabName,
    mode,
    setMode,
  ]);

  // --------------------------------------------------
  // Empty forms
  // --------------------------------------------------

  const emptyCreateForm: CreateCustomerPayload = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    user_type: "CUSTOMER",
    streetName: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
  };

  const emptyLoginForm: LoginUserPayload = {
    username: "",
    password: "",
  };

  // --------------------------------------------------
  // Create form change
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

  // --------------------------------------------------
  // Login form change
  // --------------------------------------------------

  const handleLoginChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    if (!setUserLoginForm) {
      return;
    }

    setUserLoginForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Mode change
  // --------------------------------------------------

  const handleModeChange = (
    newMode: "Create" | "Login"
  ) => {
    if (singleTab) {
      return;
    }

    setMode(newMode);

    setUserCreateForm(emptyCreateForm);
    setUserLoginForm?.(emptyLoginForm);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    try {
      setLoading(true);

      if (mode === "Create") {
        if (!userCreateForm) {
          return;
        }

       await onOrderPlaced?.();

        return;
      }

      if (mode === "Login") {
        if (!userLoginForm) {
          return;
        }

        onCustomerLogin?.();
      }
    } catch (error) {
      console.error(
        mode === "Create"
          ? "Create customer error:"
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

    setUserCreateForm(emptyCreateForm);
    setUserLoginForm?.(emptyLoginForm);

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
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "Create"
              ? "Enter your Details"
              : "Login"}
          </DialogTitle>
        </DialogHeader>

        {/* ================================================= */}
        {/* TABS */}
        {/* ================================================= */}

        {!singleTab && (
          <div className="grid grid-cols-2 border-b">

            {/* Create Tab */}

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                handleModeChange("Create")
              }
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
              Create
            </button>

            {/* Login Tab */}

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                handleModeChange("Login")
              }
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

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">

          {mode === "Create" && (
            <div className="grid grid-cols-2 gap-5">

              {/* First Name */}

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
                />
              </div>

              {/* Phone Number */}

              <div className="space-y-2">
                <Label htmlFor="register-phoneNumber">
                  Phone Number
                </Label>

                <Input
                  className="h-10"
                  id="register-phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Enter phone number"
                  value={
                    userCreateForm?.phoneNumber ?? ""
                  }
                  onChange={handleCreateChange}
                />
              </div>

              {/* Street Name */}

              <div className="space-y-2">
                <Label htmlFor="register-streetName">
                  Street Name
                </Label>

                <Input
                  className="h-10"
                  id="register-streetName"
                  name="streetName"
                  type="text"
                  placeholder="Enter street name"
                  value={
                    userCreateForm?.streetName ?? ""
                  }
                  onChange={handleCreateChange}
                />
              </div>

              {/* Area */}

              <div className="space-y-2">
                <Label htmlFor="register-area">
                  Area
                </Label>

                <Input
                  className="h-10"
                  id="register-area"
                  name="area"
                  type="text"
                  placeholder="Enter area"
                  value={
                    userCreateForm?.area ?? ""
                  }
                  onChange={handleCreateChange}
                />
              </div>

              {/* City */}

              <div className="space-y-2">
                <Label htmlFor="register-city">
                  City
                </Label>

                <Input
                  className="h-10"
                  id="register-city"
                  name="city"
                  type="text"
                  placeholder="Enter city"
                  value={
                    userCreateForm?.city ?? ""
                  }
                  onChange={handleCreateChange}
                />
              </div>

              {/* State */}

              <div className="space-y-2">
                <Label htmlFor="register-state">
                  State
                </Label>

                <Input
                  className="h-10"
                  id="register-state"
                  name="state"
                  type="text"
                  placeholder="Enter state"
                  value={
                    userCreateForm?.state ?? ""
                  }
                  onChange={handleCreateChange}
                />
              </div>

              {/* Pincode */}

              <div className="space-y-2">
                <Label htmlFor="register-pincode">
                  Pincode
                </Label>

                <Input
                  className="h-10"
                  id="register-pincode"
                  name="pincode"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter pincode"
                  value={
                    userCreateForm?.pincode ?? ""
                  }
                  onChange={handleCreateChange}
                />
              </div>

            </div>
          )}

          {/* ================================================= */}
          {/* LOGIN */}
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
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {loading
                ? mode === "Create"
                  ? "Creating..."
                  : "Logging in..."
                : mode === "Create"
                  ? "Place Order"
                  : "Login"}
            </Button>

          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}