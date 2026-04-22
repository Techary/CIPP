import { Layout as DashboardLayout } from "../../../../layouts/index.js";
import { CippTablePage } from "../../../../components/CippComponents/CippTablePage.jsx";
import { Shield } from "@mui/icons-material";

const Page = () => {
  const pageTitle = "Roles";

  const actions = [
    {
      label: "Set activation authentication context",
      type: "POST",
      url: "/api/ExecRoleAuthContext",
      icon: <Shield />,
      color: "info",
      data: {
        roleDefinitionId: "roleTemplateId",
      },
      confirmText:
        'Select the authentication context required to activate "[DisplayName]" via PIM. Leave blank to remove the requirement.',
      fields: [
        {
          type: "autoComplete",
          name: "claimValue",
          label: "Authentication context",
          multiple: false,
          creatable: false,
          api: {
            url: "/api/ListGraphRequest",
            data: {
              Endpoint: "identity/conditionalAccess/authenticationContextClassReferences",
            },
            queryKey: "RoleAuthContextOptions",
            dataKey: "Results",
            labelField: (ctx) => `${ctx.id}: ${ctx.displayName}`,
            valueField: "id",
            showRefresh: true,
          },
        },
      ],
    },
  ];

  const offCanvas = {
    extendedInfoFields: [
      "DisplayName", // Role Group Name
      "Members", // Member Names
    ],
    actions: actions,
  };

  const columns = [
    "DisplayName", // Role Name
    "Description", // Description
    "Members", // Members
  ];

  return (
    <CippTablePage
      title={pageTitle}
      apiUrl="/api/ListRoles"
      actions={actions}
      offCanvas={offCanvas}
      simpleColumns={columns}
    />
  );
};

Page.getLayout = (page) => <DashboardLayout allTenantsSupport={false}>{page}</DashboardLayout>;

export default Page;
