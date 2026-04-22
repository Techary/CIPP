import { Layout as DashboardLayout } from "../../../../layouts/index.js";
import { CippTablePage } from "../../../../components/CippComponents/CippTablePage.jsx";
import { CippAddAuthContextDrawer } from "../../../../components/CippComponents/CippAddAuthContextDrawer.jsx";
import { Edit, Notes, CheckCircle, Block, Delete } from "@mui/icons-material";
import { useSettings } from "../../../../hooks/use-settings.js";

const Page = () => {
  const pageTitle = "Authentication Contexts";
  const apiUrl = "/api/ListGraphRequest";
  const writePermissions = ["Tenant.ConditionalAccess.ReadWrite"];
  const tenant = useSettings().currentTenant;
  const queryKey = `AuthContexts-${tenant}`;

  const apiData = {
    Endpoint: "identity/conditionalAccess/authenticationContextClassReferences",
  };

  const simpleColumns = ["displayName", "id", "isAvailable", "description"];

  const offCanvas = {
    extendedInfoFields: ["id", "displayName", "description", "isAvailable"],
  };

  const actions = [
    {
      label: "Rename",
      type: "POST",
      url: "/api/ExecAuthenticationContext",
      icon: <Edit />,
      color: "info",
      data: {
        Action: "!Edit",
        id: "id",
      },
      fields: [
        {
          type: "textField",
          name: "displayName",
          label: "New Display Name",
          validators: { required: { value: true, message: "Display Name is required" } },
        },
      ],
      confirmText: `Enter a new display name for "[displayName]".`,
    },
    {
      label: "Edit description",
      type: "POST",
      url: "/api/ExecAuthenticationContext",
      icon: <Notes />,
      color: "info",
      data: {
        Action: "!Edit",
        id: "id",
      },
      fields: [
        {
          type: "textField",
          name: "description",
          label: "New Description",
          multiline: true,
          rows: 3,
        },
      ],
      confirmText: `Enter a new description for "[displayName]".`,
    },
    {
      label: "Publish to apps",
      type: "POST",
      url: "/api/ExecAuthenticationContext",
      icon: <CheckCircle />,
      color: "info",
      data: {
        Action: "!Edit",
        id: "id",
        isAvailable: "!true",
      },
      confirmText: `Publish "[displayName]" to apps? Apps will be able to tag resources with this context.`,
      condition: (row) => row.isAvailable !== true,
    },
    {
      label: "Unpublish from apps",
      type: "POST",
      url: "/api/ExecAuthenticationContext",
      icon: <Block />,
      color: "warning",
      data: {
        Action: "!Edit",
        id: "id",
        isAvailable: "!false",
      },
      confirmText: `Unpublish "[displayName]" from apps? Existing Conditional Access policies will still function.`,
      condition: (row) => row.isAvailable === true,
    },
    {
      label: "Delete",
      type: "POST",
      url: "/api/ExecAuthenticationContext",
      icon: <Delete />,
      color: "danger",
      data: {
        Action: "!Delete",
        id: "id",
      },
      confirmText: `Are you sure you want to delete "[displayName]"? Any Conditional Access policy that references this context will break.`,
      condition: (row) => row.isAvailable !== true,
    },
  ];

  return (
    <CippTablePage
      title={pageTitle}
      apiUrl={apiUrl}
      apiData={apiData}
      apiDataKey="Results"
      queryKey={queryKey}
      simpleColumns={simpleColumns}
      offCanvas={offCanvas}
      actions={actions}
      cardButton={
        <CippAddAuthContextDrawer
          requiredPermissions={writePermissions}
          relatedQueryKeys={[queryKey]}
        />
      }
    />
  );
};

Page.getLayout = (page) => <DashboardLayout allTenantsSupport={false}>{page}</DashboardLayout>;

export default Page;
