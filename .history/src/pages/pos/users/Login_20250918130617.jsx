import React from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";

function Login() {
  return (
    <CCard className="mb-6 shadow-sm">
      <CCardHeader className="font-semibold">Manage Logins</CCardHeader>
      <CCardBody>
        <CForm className="grid gap-4 mb-6">
          <CFormInput label="Username / Email" placeholder="e.g. john@store.com" />
          <CFormSelect label="Assign Role" options={["Select Role", "Admin", "Cashier", "Manager"]} />
          <CFormSelect label="Status" options={["Active", "Inactive"]} />
          <CButton color="primary">Save User</CButton>
        </CForm>

        <h2 className="text-lg font-semibold mb-3">User Accounts</h2>
        <CTable striped>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>User</CTableHeaderCell>
              <CTableHeaderCell>Role</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Last Login</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow>
              <CTableDataCell>john@store.com</CTableDataCell>
              <CTableDataCell>Cashier</CTableDataCell>
              <CTableDataCell>Active</CTableDataCell>
              <CTableDataCell>2025-09-18</CTableDataCell>
              <CTableDataCell>
                <CButton size="sm" color="info" className="me-2">Edit</CButton>
                <CButton size="sm" color="danger">Deactivate</CButton>
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
}

export default Login;
