"use client";

import React from "react";
import Grid from "@mui/material/Grid";
import DataGrid from "./_page/DataGrid";
import Conversation from "./_page/Conversation";
import { OrganizationsCol } from "@/modules/api";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import RecommendationsIcon from "@mui/icons-material/AutoFixHigh";
import useDialog from "@/modules/hooks/useDialog";
import RecommendationsDrawer from "./_page/RecommendationsDrawer";

export default function ClientEntry({ params }: { params: { orgId: string } }) {
  const [selectedConversation, setSelectedConversation] =
    React.useState<OrganizationsCol.ConversationsSubCol.Doc | null>(null);

  const {
    isOpen: isRecommendationsDrawerOpen,
    open: openRecommendationsDrawer,
    close: closeRecommendationsDrawer,
  } = useDialog();

  return (
    <React.Fragment>
      <Grid
        container
        columnSpacing={0}
        rowSpacing={{
          xs: 2,
          sm: 0,
        }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            //   TODO: get header height here
            height: "calc(100vh - 64px)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mt: 3,
              mx: 2,
            }}
          >
            Conversas
          </Typography>

          <Divider sx={{ mt: 1.5 }} />

          <DataGrid
            orgId={params.orgId}
            selectedConversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
          />
        </Grid>

        <Grid
          item
          xs={true}
          sx={{
            borderColor: (t) => {
              const isDark = t.palette.mode === "dark";
              const g = t.palette.grey;
              return `${isDark ? g[600] : g[300]} !important`;
            },
            borderLeftStyle: "solid",
            borderRightStyle: "solid",
            borderLeft: 1,
            borderRight: 1,
            height: "calc(100vh - 64px)",
          }}
        >
          <Conversation selectedConversation={selectedConversation} />
        </Grid>

        <Grid
          xs={0}
          sx={{
            // TODO: get header height here
            height: "calc(100vh - 64px)",
            width: 60,
            display: "flex",
            flexDirection: "column",
            rowGap: 2,
            py: 1,
          }}
        >
          <IconButton size="large" onClick={openRecommendationsDrawer}>
            <RecommendationsIcon />
          </IconButton>
        </Grid>
      </Grid>

      {isRecommendationsDrawerOpen && (
        <RecommendationsDrawer
          isOpen={isRecommendationsDrawerOpen}
          close={closeRecommendationsDrawer}
        />
      )}
    </React.Fragment>
  );
}
