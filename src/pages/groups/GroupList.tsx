import React, { useState, useEffect, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { Container } from "@material-ui/core";
import GroupService from "../../services/groupService";
import { Button } from "../../components";
import { useNavigate, useSearchParams } from "react-router-dom";
import TextField from "@material-ui/core/TextField";

interface Column {
  id:
    | "name"
    | "edit"
    | "delete"
    | "view";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "name", label: "Name", minWidth: 100 },
  {
    id: "edit",
    label: "Edit",
    minWidth: 100,
  },
  {
    id: "delete",
    label: "Delete",
    minWidth: 100,
  },
];

interface Data {
  id: number;
  name: string;
  users: number[];
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});

export const GroupList = () => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [records, setRecords] = useState<Data[]>([]);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("filter") || "");

  const navigate = useNavigate();
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getGroups = async () => {
    let rows: any = await GroupService.getAll();
    rows = rows.data
    setRecords(rows);
  };

  useEffect(() => {
    getGroups();
  }, []);

  const navigateToAddGroup = () => {
    navigate("/add-group");
  };

  const navigateToEditGroup = (record: any) => {
    navigate(`/update-group/${record.id}`);
  };

  const deleteGroup = async (record: any) => {
    await GroupService.delete(record.id);
    let rows: any = await GroupService.getAll();
    setRecords(rows.data);
  };

  const filteredData = useMemo(() => {
    return records.filter((x) => !search || x.name.includes(search));
  }, [records, search]);

  return (
    <>
      <Container>
        <h1>Group Information</h1>

        <Button
          text="Add New Group"
          color="primary"
          size="small"
          variant="contained"
          onClick={navigateToAddGroup}
        />
        <div>&nbsp;</div>

        <TextField
          id="search"
          label="Search"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <div>&nbsp;</div>

        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((record: any) => {
                    return (
                      <TableRow key={record.id}>
                        <TableCell>{record.name}</TableCell>
                        <TableCell>
                          <Button
                            text="Edit"
                            color="primary"
                            size="small"
                            variant="contained"
                            onClick={() => {
                              navigateToEditGroup(record);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            text="Delete"
                            color="primary"
                            size="small"
                            variant="contained"
                            onClick={() => {
                              deleteGroup(record);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={records.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>
    </>
  );
};
