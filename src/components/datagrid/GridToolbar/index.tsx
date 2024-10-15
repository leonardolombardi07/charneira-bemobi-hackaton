import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

function GridToolbar() {
  return (
    <GridToolbarContainer
      sx={{
        minHeight: 60,
      }}
    >
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}

export default GridToolbar;
