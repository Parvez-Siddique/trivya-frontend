

"use client";

import { useEffect, useState } from "react";

import {
  Eye,
  EyeOff,
  Save,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Switch } from "@/components/ui/switch";

import {
  getPaymentProviders,
  getPaymentConfigData,
  createPaymentConfig,
  updatePaymentConfig,
  type PaymentProvider,
} from "@/app/(protected)/settings/action";


export default function SettingsConfigSection() {

  const [providers, setProviders] = useState<PaymentProvider[]>([]);

  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);

  const [configId, setConfigId] = useState<number | null>(null);

  const [keyId, setKeyId] = useState("");

  const [keySecret, setKeySecret] = useState("");

  const [isActive, setIsActive] = useState(true);

  const [showSecret, setShowSecret] = useState(false);

  const [loading, setLoading] = useState(true);

  const [configLoading, setConfigLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  useEffect(() => {

    const loadProviders = async () => {

      try {

        setLoading(true);


        const response =
          await getPaymentProviders();


        if (response.success) {

          setProviders(
            response.data ?? []
          );

        } else {

          console.error(
            "Failed to fetch payment providers:",
            response.error
          );

        }

      } catch (error) {

        console.error(
          "Failed to fetch payment providers:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    loadProviders();

  }, []);


  // =========================================
  // FETCH CONFIGURATION WHEN PROVIDER CHANGES
  // =========================================

  useEffect(() => {

    if (selectedProvider === null) {

      setConfigId(null);

      setKeyId("");

      setKeySecret("");

      setIsActive(true);

      setShowSecret(false);

      setConfigLoading(false);

      return;
    }


    const loadPaymentConfig = async () => {

      setConfigId(null);

      setKeyId("");

      setKeySecret("");

      setIsActive(true);

      setShowSecret(false);

      setConfigLoading(true);


      try {

        const response = await getPaymentConfigData({payment_provider_id: selectedProvider});

        if (response.success && response.data && response.data.id) 
          {

          const config = response.data;

          setConfigId(config.id);

          setKeyId(config.key_id ?? "");

          setIsActive(config.is_active ?? true);

          setKeySecret(config.key_secret ?? "");

          return;
        }

        setConfigId(null);

        setKeyId("");

        setKeySecret("");

        setIsActive(true);

      } catch (error) {

        setConfigId(null);

        setKeyId("");

        setKeySecret("");

        setIsActive(true);

      } finally {

        setConfigLoading(false);

      }

    };


    loadPaymentConfig();

  }, [selectedProvider]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    if (selectedProvider === null) {
      return;
    }

    if (configLoading) {

      return;
    }

    if (!keyId.trim()) {

      return;
    }

    if (configId === null && !keySecret.trim()) {

      return;
    }


    try {

      setSaving(true);

      if (configId === null) {

        const payload = {

          provider: selectedProvider,

          key_id: keyId.trim(),

          key_secret: keySecret.trim(),

          is_active: isActive,

        };

        const response = await createPaymentConfig(payload);

        if (!response.success) {
          return;
        }

        setKeySecret("");

        if (response.data && typeof response.data === "object" && "id" in response.data) {

          setConfigId(Number(response.data.id));

        }

        return;
      }

      const updatePayload: {

        provider: number;

        key_id: string;

        key_secret?: string;

        is_active: boolean;

      } = {

        provider: selectedProvider,

        key_id: keyId.trim(),

        is_active: isActive,

      };

      if (keySecret.trim()) {
        updatePayload.key_secret = keySecret.trim();
      }


      const response = await updatePaymentConfig(configId, updatePayload);

      if (!response.success) {
        return;
      }

    } catch (error) {

    } finally {

      setSaving(false);

    }

  };

  return (

    <div className="w-full max-w-2xl">

      <Card>

        <CardHeader>

          <CardTitle>
            Payment Configuration
          </CardTitle>


          <CardDescription>
            Configure the payment gateway credentials
            used to process customer payments.
          </CardDescription>

        </CardHeader>

        <CardContent>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-2">

              <Label htmlFor="provider">
                Payment Provider
              </Label>


              <Select
              value={selectedProvider !== null ? String(selectedProvider) : undefined}
              onValueChange={(value) => {
                setSelectedProvider(value ? Number(value) : null);
              }}
              disabled={loading || saving}
            >
              <SelectTrigger id="provider" className="h-10 w-full">
                <SelectValue
                  placeholder={
                    loading
                      ? "Loading providers..."
                      : "Select payment provider"
                  }
                >
                  {selectedProvider !== null
                    ? providers.find(
                        (provider) => provider.id === selectedProvider
                      )?.name
                    : undefined}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {providers.length === 0 ? (
                  <SelectItem value="no-provider" disabled>
                    No payment providers available
                  </SelectItem>
                ) : (
                  providers.map((provider) => (
                    <SelectItem
                      key={provider.id}
                      value={String(provider.id)}
                    >
                      {provider.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            </div>

            {configLoading && (

              <div className="flex items-center gap-2 text-sm text-muted-foreground">

                <Loader2
                  className="h-4 w-4 animate-spin"
                />

                Loading payment configuration...

              </div>

            )}


            {/* ================================= */}
            {/* KEY ID */}
            {/* ================================= */}

            <div className="space-y-2">

              <Label htmlFor="key-id">
                Key ID
              </Label>


              <Input
                id="key-id"
                type="text"
                placeholder="Enter payment gateway Key ID"
                value={keyId}

                onChange={(e) =>
                  setKeyId(
                    e.target.value
                  )
                }

                disabled={
                  saving ||
                  configLoading ||
                  selectedProvider === null
                }

                className="h-10"
              />


              <p className="text-sm text-muted-foreground">

                For Razorpay, this usually starts
                with{" "}

                <span className="font-medium">
                  rzp_test_
                </span>{" "}

                in test mode.

              </p>

            </div>


            {/* ================================= */}
            {/* SECRET KEY */}
            {/* ================================= */}

            <div className="space-y-2">

              <Label htmlFor="key-secret">
                Secret Key
              </Label>


              <div className="relative">

                <Input
                  id="key-secret"

                  type={
                    showSecret
                      ? "text"
                      : "password"
                  }

                  placeholder={
                    configId !== null
                      ? "Enter new secret key to change it"
                      : "Enter payment gateway Secret Key"
                  }

                  value={keySecret}

                  onChange={(e) =>
                    setKeySecret(
                      e.target.value
                    )
                  }

                  disabled={
                    saving ||
                    configLoading ||
                    selectedProvider === null
                  }

                  className="h-10 pr-10"
                />


                <button
                  type="button"

                  onClick={() =>
                    setShowSecret(
                      !showSecret
                    )
                  }

                  disabled={
                    saving ||
                    configLoading ||
                    selectedProvider === null
                  }

                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-muted-foreground
                    hover:text-foreground
                    disabled:pointer-events-none
                    disabled:opacity-50
                  "

                  aria-label={
                    showSecret
                      ? "Hide secret key"
                      : "Show secret key"
                  }
                >

                  {showSecret ? (

                    <EyeOff
                      className="h-4 w-4"
                    />

                  ) : (

                    <Eye
                      className="h-4 w-4"
                    />

                  )}

                </button>

              </div>


              <p className="text-sm text-muted-foreground">

                {configId !== null

                  ? "Leave this blank to keep the existing secret key."

                  : "Your secret key is securely stored and should never be exposed to users."

                }

              </p>

            </div>


            {/* ================================= */}
            {/* ACTIVE STATUS */}
            {/* ================================= */}

            <div className="flex items-center justify-between rounded-lg border p-4">

              <div className="space-y-1">

                <Label>
                  Enable Payment Gateway
                </Label>


                <p className="text-sm text-muted-foreground">

                  Enable this gateway for customer
                  payments.

                </p>

              </div>


              <Switch
                checked={isActive}

                onCheckedChange={
                  setIsActive
                }

                disabled={
                  saving ||
                  configLoading ||
                  selectedProvider === null
                }
              />

            </div>


            {/* ================================= */}
            {/* SAVE BUTTON */}
            {/* ================================= */}

            <div className="flex justify-end">

              <Button
                type="submit"

                disabled={
                  saving ||
                  loading ||
                  configLoading ||
                  selectedProvider === null ||
                  providers.length === 0
                }

                className="h-10"
              >

                {/* -------------------------------- */}
                {/* Saving */}
                {/* -------------------------------- */}

                {saving ? (

                  <>

                    <Loader2
                      className="mr-2 h-4 w-4 animate-spin"
                    />

                    Saving...

                  </>

                ) : configLoading ? (

                  /* --------------------------------
                     Loading configuration
                     -------------------------------- */

                  <>

                    <Loader2
                      className="mr-2 h-4 w-4 animate-spin"
                    />

                    Loading...

                  </>

                ) : configId !== null ? (

                  /* --------------------------------
                     UPDATE MODE
                     -------------------------------- */

                  <>

                    <Save
                      className="mr-2 h-4 w-4"
                    />

                    Update Configuration

                  </>

                ) : (

                  /* --------------------------------
                     CREATE MODE
                     -------------------------------- */

                  <>

                    <Save
                      className="mr-2 h-4 w-4"
                    />

                    Create Configuration

                  </>

                )}

              </Button>

            </div>

          </form>

        </CardContent>

      </Card>

    </div>

  );

}