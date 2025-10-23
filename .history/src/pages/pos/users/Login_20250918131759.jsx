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
  CInputGroup,
  CInputGroupText,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilUser,
  cilSave,
  cilPencil,
  cilTrash,
  cilCheckCircle,
  cilBan,
  cilSearch,
  cilFilter,
} from "@coreui/icons";

function Login() {
  return (
    <div className="space-y-6">
      {/* 🔹 User Form Section */}
      <CCard className="shadow-lg border-0 rounded-4">
        <CCardHeader className="bg-gradient-primary text-white fw-semibold d-flex align-items-center">
          <CIcon icon={cilUser} className="me-2" />
          Add / Manage User Login
        </CCardHeader>
        <CCardBody>
          <CForm className="row g-4">
            <div className="col-md-4">
              <CFormInput
                label="Username / Email"
                placeholder="e.g. john@store.com"
              />
            </div>
            <div className="col-md-4">
              <CFormSelect
                label="Assign Role"
                options={["Select Role", "Admin", "Cashier", "Manager"]}
              />
            </div>
            <div className="col-md-4">
              <CFormSelect label="Status" options={["Active", "Inactive"]} />
            </div>

            {/* Save Button */}
            <div className="col-12 text-end">
              <CButton color="primary" size="lg" className="px-4 fw-semibold">
                <CIcon icon={cilSave} className="me-2" />
                Save User
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>

      {/* 🔹 Users Table Section */}
      <CCard className="shadow-md border-0 rounded-4">
        <CCardHeader className="bg-light fw-semibold d-flex justify-content-between align-items-center">
          <span>User Accounts</span>

          {/* Search + Filter Bar */}
          <div className="d-flex gap-2">
            <CInputGroup>
              <CInputGroupText>
                <CIcon icon={cilSearch} />
              </CInputGroupText>
              <CFormInput placeholder="Search user..." />
            </CInputGroup>
            <CFormSelect
              className="w-auto"
              options={["Filter by Role", "Admin", "Cashier", "Manager"]}
            />
            <CButton color="secondary">
              <CIcon icon={cilFilter} className="me-2" />
              Filter
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <div className="table-responsive">
            <CTable striped hover>
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell>User</CTableHeaderCell>
                  <CTableHeaderCell>Role</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Last Login</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Actions
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell>john@store.com</CTableDataCell>
                  <CTableDataCell>
                    <span className="badge rounded-pill bg-info text-dark px-3 py-2">
                      Cashier
                    </span>
                  </CTableDataCell>
                  <CTableDataCell>
                    <span className="badge rounded-pill bg-success px-3 py-2">
                      Active
                    </span>
                  </CTableDataCell>
                  <CTableDataCell>2025-09-18</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButton
                      size="sm"
                      color="info"
                      className="me-2"
                      title="Edit"
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      size="sm"
                      color="danger"
                      className="me-2"
                      title="Deactivate"
                    >
                      <CIcon icon={cilBan} />
                    </CButton>
                    <CButton size="sm" color="success" title="Activate">
                      <CIcon icon={cilCheckCircle} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>

                <CTableRow>
                  <CTableDataCell>mary@store.com</CTableDataCell>
                  <CTableDataCell>
                    <span className="badge rounded-pill bg-warning text-dark px-3 py-2">
                      Manager
                    </span>
                  </CTableDataCell>
                  <CTableDataCell>
                    <span className="badge rounded-pill bg-danger px-3 py-2">
                      Inactive
                    </span>
                  </CTableDataCell>
                  <CTableDataCell>2025-09-10</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButton
                      size="sm"
                      color="info"
                      className="me-2"
                      title="Edit"
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      size="sm"
                      color="danger"
                      className="me-2"
                      title="Delete"
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                    <CButton size="sm" color="success" title="Activate">
                      <CIcon icon={cilCheckCircle} />
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
