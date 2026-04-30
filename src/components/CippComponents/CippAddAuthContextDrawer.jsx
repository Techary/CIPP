import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@mui/material";
import { Grid } from "@mui/system";
import { useForm, useFormState } from "react-hook-form";
import { AddCircle } from "@mui/icons-material";
import { CippOffCanvas } from "./CippOffCanvas";
import CippFormComponent from "./CippFormComponent";
import { CippApiResults } from "./CippApiResults";
import { useSettings } from "../../hooks/use-settings";
import { ApiGetCall, ApiPostCall } from "../../api/ApiCall";

const AUTH_CONTEXT_ENDPOINT = "identity/conditionalAccess/authenticationContextClassReferences";
// Spec (https://learn.microsoft.com/en-us/graph/api/resources/authenticationcontextclassreference?view=graph-rest-1.0) says c1 > c25, Entra shows 1-199.
// I'm going to keep in line with the spec but if YOU want to expand, update all three in unison:
//   - this constant (length)
//   - CIPP-API/.../Invoke-ExecAuthenticationContext.ps1 (id regex)
//   - CIPP-API/.../Invoke-ExecRoleAuthContext.ps1 (claimValue regex)
const ALL_IDS = Array.from({ length: 25 }, (_, i) => `c${i + 1}`);

const defaultValues = {
  id: null,
  displayName: "",
  description: "",
  isAvailable: true,
};

export const CippAddAuthContextDrawer = ({
  buttonText = "Add Authentication Context",
  requiredPermissions = [],
  PermissionButton = Button,
  relatedQueryKeys = [],
}) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const tenantDomain = useSettings().currentTenant;

  const existingContextsApi = ApiGetCall({
    url: "/api/ListGraphRequest",
    queryKey: `AuthContextOptions-${tenantDomain}`,
    data: { tenantFilter: tenantDomain, Endpoint: AUTH_CONTEXT_ENDPOINT },
    waiting: drawerVisible,
  });

  const idOptions = useMemo(() => {
    const existing = new Set(
      (existingContextsApi?.data?.Results ?? []).map((r) => r.id).filter(Boolean)
    );
    return ALL_IDS.filter((id) => !existing.has(id)).map((id) => ({ label: id, value: id }));
  }, [existingContextsApi?.data]);

  const formControl = useForm({ mode: "onChange", defaultValues });
  const { isValid } = useFormState({ control: formControl.control });

  const invalidateKeys = [`AuthContextOptions-${tenantDomain}`, ...relatedQueryKeys];

  const addAuthContext = ApiPostCall({
    urlFromData: true,
    relatedQueryKeys: invalidateKeys,
  });

  useEffect(() => {
    if (addAuthContext.isSuccess) {
      formControl.reset(defaultValues);
    }
  }, [addAuthContext.isSuccess, formControl]);

  const handleSubmit = () => {
    formControl.trigger();
    if (!isValid) return;

    const formData = formControl.getValues();
    addAuthContext.mutate({
      url: "/api/ExecAuthenticationContext",
      data: {
        tenantFilter: tenantDomain,
        Action: "Add",
        id: formData.id?.value ?? formData.id,
        displayName: formData.displayName,
        description: formData.description,
        isAvailable: formData.isAvailable,
      },
      relatedQueryKeys: invalidateKeys,
    });
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    formControl.reset(defaultValues);
  };

  const noneAvailable = !existingContextsApi.isFetching && idOptions.length === 0;

  return (
    <>
      <PermissionButton
        {...(PermissionButton !== Button ? { requiredPermissions } : {})}
        onClick={() => setDrawerVisible(true)}
        startIcon={<AddCircle />}
      >
        {buttonText}
      </PermissionButton>
      <CippOffCanvas
        title="Add Authentication Context"
        visible={drawerVisible}
        onClose={handleCloseDrawer}
        size="md"
        footer={
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-start" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={addAuthContext.isLoading || !isValid || noneAvailable}
            >
              {addAuthContext.isLoading
                ? "Adding..."
                : addAuthContext.isSuccess
                ? "Add Another"
                : "Add"}
            </Button>
            <Button variant="outlined" onClick={handleCloseDrawer}>
              Close
            </Button>
          </div>
        }
      >
        <Grid container spacing={2}>
          <Grid size={{ md: 4, xs: 12 }}>
            <CippFormComponent
              type="autoComplete"
              label="ID *"
              name="id"
              formControl={formControl}
              multiple={false}
              creatable={false}
              options={idOptions}
              isFetching={existingContextsApi.isFetching}
              placeholder={noneAvailable ? "All IDs in use" : "Select an ID"}
              validators={{ required: { value: true, message: "ID is required" } }}
            />
          </Grid>
          <Grid size={{ md: 8, xs: 12 }}>
            <CippFormComponent
              type="textField"
              label="Display Name *"
              name="displayName"
              formControl={formControl}
              validators={{ required: "Display Name is required" }}
            />
          </Grid>
          <Grid size={{ md: 12, xs: 12 }}>
            <CippFormComponent
              type="textField"
              label="Description"
              name="description"
              multiline
              rows={3}
              formControl={formControl}
            />
          </Grid>
          <Grid size={{ md: 12, xs: 12 }}>
            <CippFormComponent
              type="switch"
              label="Publish to apps"
              name="isAvailable"
              formControl={formControl}
            />
          </Grid>
          <CippApiResults apiObject={addAuthContext} />
        </Grid>
      </CippOffCanvas>
    </>
  );
};
