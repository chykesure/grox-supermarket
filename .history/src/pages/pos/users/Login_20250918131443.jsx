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
    <div className="space-y-6">
      {/* ✅ User Form Section */}
      <CCard className="shadow-lg border-0 rounded-3">
        <CCardHeader className="bg-primary text-white fw-semibold">
          Add / Manage User Login
        </CCardHeader>
        <CCardBody>
          <CForm className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <CFormInput
              label="Username / Email"
              placeholder="e.g. john@store.com"
            />
            <CFormSelect
              label="Assign Role"
              options={["Select Role", "Admin", "Cashier", "Manager"]}
            />
            <CFormSelect
              label="Status"
              options={["Active", "Inactive"]}
            />

            {/* Action Button full width on mobile */}
            <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
              <CButton color="primary" size="lg" className="px-5 fw-semibold">
                Save User
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>

      {/* ✅ Users Table Section */}
      <CCard className="shadow-md border-0 rounded-3">
        <CCardHeader className="bg-light fw-semibold">
          User Accounts
        </CCardHeader>
        <CCardBody>
          <div className="overflow-x-auto">
            <CTable striped hover responsive>
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell scope="col">User</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Role</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Last Login</CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="text-center">
                    Actions
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell>john@store.com</CTableDataCell>
                  <CTableDataCell>
                    <span className="badge bg-info text-dark">Cashier</span>
                  </CTableDataCell>
                  <CTableDataCell>
                    <span className="badge bg-success">Active</span>
                  </CTableDataCell>
                  <CTableDataCell>2025-09-18</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButton size="sm" color="info" variant="outline" className="me-2">
                      Edit
                    </CButton>
                    <CButton size="sm" color="danger" variant="outline">
                      Deactivate
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
}

export default Login;
