```ts
// Service to interact with Google Apps Script Backend

const GAS_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbyj-ZKxYPoGXpi4z3smgBcGBFNAzCyfnHg8ZncfH2lAS17m0wWGUHSPP722OxoQ54--/exec";

// HARUS SAMA DENGAN SCRIPT PROPERTIES GAS
const ADMIN_SECRET =
  "SDN010_PPDB_2026_X9kLp2QaM7vRt8Zw";

export interface FormField {
  id: string;
  label: string;
  type:
    | 'text'
    | 'number'
    | 'select'
    | 'date'
    | 'file'
    | 'textarea';

  options?: string[];
  required: boolean;
}

export interface RegistrationData {
  [key: string]: any;
}

export interface AdminData
  extends RegistrationData {

  Timestamp: string;

  'No Pendaftaran': string;

  Status:
    | 'Proses'
    | 'Lulus'
    | 'Tidak Lulus';

  'Alasan Penolakan'?: string;
}

export interface AppSettings {

  namaSekolah: string;

  alamat: string;

  telepon: string;

  email: string;

  deskripsi: string;

  statusPendaftaran:
    | 'Buka'
    | 'Tutup';

  formFields: FormField[];

}

/**
 * =========================================
 * GET SETTINGS
 * =========================================
 */

export const getSettings =
async (): Promise<AppSettings> => {

  try {

    const response = await fetch(
      `${GAS_WEB_APP_URL}?action=getSettings&t=${Date.now()}`
    );

    const result =
      await response.json();

    if (result.status === "success") {

      return {

        ...result.data,

        formFields:
          typeof result.data.formFields === "string"
            ? JSON.parse(result.data.formFields)
            : result.data.formFields

      };

    }

    throw new Error(
      result.message || "Gagal mengambil settings"
    );

  } catch (error) {

    console.error(
      "Error fetching settings:",
      error
    );

    throw error;

  }

};

/**
 * =========================================
 * SUBMIT REGISTRATION
 * =========================================
 */

export const submitRegistration =
async (data: RegistrationData) => {

  try {

    const response = await fetch(
      GAS_WEB_APP_URL,
      {

        method: "POST",

        body: JSON.stringify(data),

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        }

      }
    );

    return await response.json();

  } catch (error) {

    console.error(
      "Error submitting registration:",
      error
    );

    throw error;

  }

};

/**
 * =========================================
 * GET REGISTRATIONS
 * =========================================
 */

export const getRegistrations =
async (): Promise<AdminData[]> => {

  try {

    const response = await fetch(
      `${GAS_WEB_APP_URL}?action=getRegistrations&adminSecret=${ADMIN_SECRET}&t=${Date.now()}`
    );

    const result =
      await response.json();

    if (result.status === "success") {
      return result.data;
    }

    throw new Error(
      result.message || "Gagal mengambil data"
    );

  } catch (error) {

    console.error(
      "Error fetching registrations:",
      error
    );

    throw error;

  }

};

/**
 * =========================================
 * UPDATE STATUS
 * =========================================
 */

export const updateStatus =
async (
  noPendaftaran: string,
  newStatus: string,
  alasan?: string
) => {

  try {

    const response = await fetch(
      GAS_WEB_APP_URL,
      {

        method: "POST",

        body: JSON.stringify({

          action: "updateStatus",

          adminSecret:
            ADMIN_SECRET,

          noPendaftaran,

          newStatus,

          alasan

        }),

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        }

      }
    );

    return await response.json();

  } catch (error) {

    console.error(
      "Error updating status:",
      error
    );

    throw error;

  }

};

/**
 * =========================================
 * UPDATE SETTINGS
 * =========================================
 */

export const updateSettings =
async (
  settings: Partial<AppSettings>
) => {

  try {

    const response = await fetch(
      GAS_WEB_APP_URL,
      {

        method: "POST",

        body: JSON.stringify({

          action: "updateSettings",

          adminSecret:
            ADMIN_SECRET,

          settings

        }),

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        }

      }
    );

    return await response.json();

  } catch (error) {

    console.error(
      "Error updating settings:",
      error
    );

    throw error;

  }

};

/**
 * =========================================
 * CHECK STATUS
 * =========================================
 */

export const checkStatus =
async (
  noPendaftaran: string
) => {

  try {

    const response = await fetch(
      GAS_WEB_APP_URL,
      {

        method: "POST",

        body: JSON.stringify({

          action: "checkStatus",

          noPendaftaran

        }),

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        }

      }
    );

    return await response.json();

  } catch (error) {

    console.error(
      "Error checking status:",
      error
    );

    throw error;

  }

};

/**
 * =========================================
 * LOGIN ADMIN
 * =========================================
 */

export const loginAdmin =
async (
  username: string,
  password: string
) => {

  try {

    const response = await fetch(
      GAS_WEB_APP_URL,
      {

        method: "POST",

        body: JSON.stringify({

          action: "login",

          username,

          password

        }),

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        }

      }
    );

    return await response.json();

  } catch (error) {

    console.error(
      "Error logging in:",
      error
    );

    throw error;

  }

};
```
