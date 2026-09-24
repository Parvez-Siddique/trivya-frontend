
"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusOption {
  value: string;
  label: string;
}

interface OrderStatusModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  payment_status_value: string;
  payment_status_state: React.Dispatch<React.SetStateAction<string>>;

  order_status_value: string;
  order_status_state: React.Dispatch<React.SetStateAction<string>>;

  paymentStatusList: StatusOption[];
  orderStatusList: StatusOption[];

  onSave?: () => void;
}

export default function OrderStatusModal({
  open,
  setOpen,

  payment_status_value,
  payment_status_state,

  order_status_value,
  order_status_state,

  paymentStatusList,
  orderStatusList,

  onSave,
}: OrderStatusModalProps) {

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    const statusData = {
      payment_status: payment_status_value,
      order_status: order_status_value,
    };

    e.preventDefault();
    onSave?.();

    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >

      <DialogContent className="sm:max-w-[500px]">

        <DialogHeader>
          <DialogTitle>
            Update Order Status
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 pt-2"
        >

          <div className="space-y-2">

            <Label htmlFor="payment-status">
              Payment Status
            </Label>

            <Select
              value={payment_status_value}
              onValueChange={(value) => {
                if (value !== null){
                    payment_status_state(value)
                }}}
            >

              <SelectTrigger
                id="payment-status"
                className="h-10 w-full"
              >
                <SelectValue placeholder="Select payment status" />
              </SelectTrigger>

              <SelectContent>

                {paymentStatusList.map((status) => (

                  <SelectItem
                    key={status.value}
                    value={status.label}
                  >
                    {status.label}
                  </SelectItem>

                ))}

              </SelectContent>

            </Select>

          </div>


          {/* ================================================= */}
          {/* ORDER STATUS */}
          {/* ================================================= */}

          <div className="space-y-2">

            <Label htmlFor="order-status">
              Order Status
            </Label>

            <Select
              value={order_status_value}
              onValueChange={(value) => {
                if (value !== null){
                    order_status_state(value)
                }}}
            >

              <SelectTrigger
                id="order-status"
                className="h-10 w-full"
              >
                <SelectValue placeholder="Select order status" />
              </SelectTrigger>

              <SelectContent>

                {orderStatusList.map((status) => (

                  <SelectItem
                    key={status.value}
                    value={status.label}
                  >
                    {status.label}
                  </SelectItem>

                ))}

              </SelectContent>

            </Select>

          </div>


          {/* ================================================= */}
          {/* FOOTER */}
          {/* ================================================= */}

          <DialogFooter className="pt-3">

            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                !payment_status_value ||
                !order_status_value
              }
              className="
                bg-primary-thick
                text-white
                hover:opacity-90
                cursor-pointer
              "
            >
              Update Status
            </Button>

          </DialogFooter>

        </form>

      </DialogContent>

    </Dialog>
  );
}
