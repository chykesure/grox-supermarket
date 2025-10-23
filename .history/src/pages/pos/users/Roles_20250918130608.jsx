import React from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormInput,
  CFormCheck,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";

function Roles() {
  return (
    <CCard className="mb-6 shadow-sm">
      <CCardHeader className="font-semibold">Manage Roles</CCardHeader>
      <CCardBody>
        <CForm className="grid gap-4 mb-6">
          <CFormInput label="Role Name" placeholder="e.g. Cashier" />
          <div>
            <p className="font-medium mb-2">Permissions</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <CFormCheck label="View Reports" />
              <CFormCheck label="Manage Customers" />
              <CFormCheck label="Process Sales" />
              <CFormCheck label="Refund Items" />
              <CFormCheck label="Manage Users" />
            </div>
          </div>
          <CButton color="primary">Save Role</CButton>
        </CForm>

        <h2 className="text-lg font-semibold mb-3">Existing Roles</h2>
        <CTable striped>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Role</CTableHeaderCell>
              <CTableHeaderCell>Permissions</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow>
              <CTableDataCell>Admin</CTableDataCell>
              <CTableDataCell>All Access</CTableDataCell>
              <CTableDataCell>
                <CButton size="sm" color="info" className="me-2">Edit</CButton>
                <CButton size="sm" color="danger">Delete</CButton>
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
}

export default Roles;
