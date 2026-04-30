import { Layout as DashboardLayout } from "../../../layouts/index.js";
import { CippTablePage } from "../../../components/CippComponents/CippTablePage.jsx";
import { Button } from "@mui/material";
import {
  Add,
  AddToPhotos,
  PersonAdd,
  PersonRemove,
  AdminPanelSettings,
  NoAccounts,
  Delete,
<<<<<<< HEAD
  Lock,
  LockOpen,
} from '@mui/icons-material'
import Link from 'next/link'
import { Stack } from '@mui/system'
import { CippDataTable } from '../../../components/CippTable/CippDataTable'
import { CippPropertyListCard } from '../../../components/CippCards/CippPropertyListCard'
import { useSettings } from '../../../hooks/use-settings'
import { useCippReportDB } from '../../../components/CippComponents/CippReportDBControls'
import { ApiGetCall } from '../../../api/ApiCall'

const SiteAuthContextCard = ({ webUrl, tenantFilter }) => {
  const authContextApi = ApiGetCall({
    url: '/api/ListSPOSiteAuthContext',
    data: { siteUrl: webUrl, tenantFilter },
    queryKey: `SPOSiteAuthContext-${tenantFilter}-${webUrl}`,
  })

  const data = authContextApi.data
  const isLoading = authContextApi.isFetching || authContextApi.isLoading
  const isError = authContextApi.isError

  const propertyItems = isLoading
    ? [{ label: 'Status', value: 'Loading…' }]
    : isError
      ? [{ label: 'Status', value: 'Could not read site auth context.' }]
      : [
          {
            label: 'Conditional Access Policy',
            value: data?.conditionalAccessPolicyName || 'Unknown',
          },
          {
            label: 'Authentication Context',
            value: data?.authenticationContextName || '(none)',
          },
          {
            label: 'Auth Context Active',
            value: data?.isAuthContextActive ? 'Yes' : 'No',
          },
        ]

  return (
    <CippPropertyListCard
      title="Authentication Context"
      propertyItems={propertyItems}
      variant="outlined"
    />
  )
}
=======
} from "@mui/icons-material";
import Link from "next/link";
import { CippDataTable } from "../../../components/CippTable/CippDataTable";
import { useSettings } from "../../../hooks/use-settings";
>>>>>>> parent of b87296a68 (Squashed commit of the following:)

const Page = () => {
  const pageTitle = "SharePoint Sites";
  const tenantFilter = useSettings().currentTenant;

  const actions = [
    {
      label: "Add Member",
      type: "POST",
      icon: <PersonAdd />,
      url: "/api/ExecSetSharePointMember",
      data: {
        groupId: "ownerPrincipalName",
        add: true,
        URL: "webUrl",
        SharePointType: "rootWebTemplate",
      },
      confirmText: "Select the User to add as a member.",
      fields: [
        {
          type: "autoComplete",
          name: "user",
          label: "Select User",
          multiple: false,
          creatable: false,
          api: {
            url: "/api/ListGraphRequest",
            data: {
              Endpoint: "users",
              $select: "id,displayName,userPrincipalName",
              $top: 999,
              $count: true,
            },
            queryKey: "ListUsersAutoComplete",
            dataKey: "Results",
            labelField: (user) => `${user.displayName} (${user.userPrincipalName})`,
            valueField: "userPrincipalName",
            addedField: {
              id: "id",
            },
            showRefresh: true,
          },
        },
      ],
      multiPost: false,
    },
    {
      label: "Remove Member",
      type: "POST",
      icon: <PersonRemove />,
      url: "/api/ExecSetSharePointMember",
      data: {
        groupId: "ownerPrincipalName",
        add: false,
        URL: "URL",
        SharePointType: "rootWebTemplate",
      },
      confirmText: "Select the User to remove as a member.",
      fields: [
        {
          type: "autoComplete",
          name: "user",
          label: "Select User",
          multiple: false,
          creatable: false,
          api: {
            url: "/api/ListGraphRequest",
            data: {
              Endpoint: "users",
              $select: "id,displayName,userPrincipalName",
              $top: 999,
              $count: true,
            },
            queryKey: "ListUsersAutoComplete",
            dataKey: "Results",
            labelField: (user) => `${user.displayName} (${user.userPrincipalName})`,
            valueField: "userPrincipalName",
            addedField: {
              id: "id",
            },
            showRefresh: true,
          },
        },
      ],
      multiPost: false,
    },
    {
      label: "Add Site Admin",
      type: "POST",
      icon: <AdminPanelSettings />,
      url: "/api/ExecSharePointPerms",
      data: {
        UPN: "ownerPrincipalName",
        RemovePermission: false,
        URL: "webUrl",
      },
      confirmText: "Select the User to add to the Site Admins permissions",
      fields: [
        {
          type: "autoComplete",
          name: "user",
          label: "Select User",
          multiple: false,
          creatable: false,
          api: {
            url: "/api/ListGraphRequest",
            data: {
              Endpoint: "users",
              $select: "id,displayName,userPrincipalName",
              $top: 999,
              $count: true,
            },
            queryKey: "ListUsersAutoComplete",
            dataKey: "Results",
            labelField: (user) => `${user.displayName} (${user.userPrincipalName})`,
            valueField: "userPrincipalName",
            addedField: {
              id: "id",
            },
            showRefresh: true,
          },
        },
      ],
      multiPost: false,
    },
    {
      label: "Remove Site Admin",
      type: "POST",
      icon: <NoAccounts />,
      url: "/api/ExecSharePointPerms",
      data: {
        UPN: "ownerPrincipalName",
        RemovePermission: true,
        URL: "webUrl",
      },
      confirmText: "Select the User to remove from the Site Admins permissions",
      fields: [
        {
          type: "autoComplete",
          name: "user",
          label: "Select User",
          multiple: false,
          creatable: false,
          api: {
            url: "/api/ListGraphRequest",
            data: {
              Endpoint: "users",
              $select: "id,displayName,userPrincipalName",
              $top: 999,
              $count: true,
            },
            queryKey: "ListUsersAutoComplete",
            dataKey: "Results",
            labelField: (user) => `${user.displayName} (${user.userPrincipalName})`,
            valueField: "userPrincipalName",
            addedField: {
              id: "id",
            },
            showRefresh: true,
          },
        },
      ],
      multiPost: false,
    },
    {
<<<<<<< HEAD
      label: 'Set Authentication Context',
      type: 'POST',
      icon: <Lock />,
      url: '/api/ExecSetSPOSiteAuthContext',
      data: {
        siteUrl: 'webUrl',
        conditionalAccessPolicy: '!AuthenticationContext',
      },
      confirmText:
        'Select an Entra Authentication Context to require for access to this site. ' +
        'Users without an active session that satisfies the Conditional Access policy bound to this context will be challenged or blocked the next time they access the site. ' +
        'When applying to multiple sites at once, every selected site receives the same context.',
      fields: [
        {
          type: 'autoComplete',
          name: 'authenticationContextName',
          label: 'Authentication Context',
          multiple: false,
          creatable: false,
          required: true,
          api: {
            url: '/api/ListGraphRequest',
            data: {
              Endpoint: 'identity/conditionalAccess/authenticationContextClassReferences',
            },
            queryKey: 'AuthContextOptions',
            dataKey: 'Results',
            labelField: (ctx) =>
              ctx.displayName ? `${ctx.id}: ${ctx.displayName}` : ctx.id,
            valueField: 'displayName',
            showRefresh: true,
          },
        },
      ],
      multiPost: false,
    },
    {
      label: 'Remove Authentication Context',
      type: 'POST',
      icon: <LockOpen />,
      url: '/api/ExecSetSPOSiteAuthContext',
      data: {
        siteUrl: 'webUrl',
        conditionalAccessPolicy: '!AllowFullAccess',
      },
      confirmText:
        'This will set Conditional Access Policy to AllowFullAccess (the default) on every selected site, removing any Authentication Context binding. ' +
        'Note: if a site was previously on AllowLimitedAccess or BlockAccess for unmanaged devices, that restriction is also cleared. ' +
        'Review the offCanvas details for each site before confirming.',
      multiPost: false,
    },
    {
      label: 'Delete Site',
      type: 'POST',
=======
      label: "Delete Site",
      type: "POST",
>>>>>>> parent of b87296a68 (Squashed commit of the following:)
      icon: <Delete />,
      url: "/api/DeleteSharepointSite",
      data: {
        SiteId: "siteId",
      },
      confirmText: "Are you sure you want to delete this SharePoint site? This action cannot be undone.",
      color: "error",
      multiPost: false,
    },
  ];

  const offCanvas = {
    extendedInfoFields: ["displayName", "description", "webUrl"],
    actions: actions,
    children: (row) => (
<<<<<<< HEAD
      <Stack spacing={2}>
        <SiteAuthContextCard webUrl={row.webUrl} tenantFilter={tenantFilter} />
        <CippDataTable
          title="Site Members"
          queryKey={`site-members-${row.siteId}`}
          api={{
            url: '/api/ListSiteMembers',
            data: {
              SiteId: row.siteId,
              tenantFilter: tenantFilter,
            },
            dataKey: 'Results',
          }}
          simpleColumns={['fields.Title', 'fields.EMail', 'fields.IsSiteAdmin']}
        />
      </Stack>
=======
      <CippDataTable
        title="Site Members"
        queryKey={`site-members-${row.siteId}`}
        api={{
          url: "/api/ListSiteMembers",
          data: {
            SiteId: row.siteId,
            tenantFilter: tenantFilter,
          },
          dataKey: "Results",
        }}
        simpleColumns={["fields.Title", "fields.EMail", "fields.IsSiteAdmin"]}
      />
>>>>>>> parent of b87296a68 (Squashed commit of the following:)
    ),
    size: "lg", // Make the offcanvas extra large
  };

  return (
    <CippTablePage
      title={pageTitle}
      apiUrl="/api/ListSites?type=SharePointSiteUsage"
      actions={actions}
      offCanvas={offCanvas}
      simpleColumns={[
        "displayName",
        "createdDateTime",
        "ownerPrincipalName",
        "lastActivityDate",
        "fileCount",
        "storageUsedInGigabytes",
        "storageAllocatedInGigabytes",
        "reportRefreshDate",
        "webUrl",
      ]}
      cardButton={
        <>
          <Button component={Link} href="/teams-share/sharepoint/add-site" startIcon={<Add />}>
            Add Site
          </Button>
          <Button
            component={Link}
            href="/teams-share/sharepoint/bulk-add-site"
            startIcon={<AddToPhotos />}
          >
            Bulk Add Sites
          </Button>
        </>
      }
    />
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
