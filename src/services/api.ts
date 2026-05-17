```ts
// Service to interact with Google Apps Script Backend

const GAS_WEB_APP_URL = "";

// HARUS SAMA DENGAN ADMIN_SECRET DI GOOGLE APPS SCRIPT
const ADMIN_SECRET = "SDN010_PPDB_2026_X9kLp2QaM7vRt8Zw";

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'file' | 'textarea';
  options?: string[];
  required: boolean;
}

export interface PanduanDokumen {
  id: string;
  icon: 'FileDigit' | 'FileBadge' | 'FileImage' | 'FileText';
  title: string;
  description: string;
}

export interface AppSettings {
  namaSekolah: string;
  alamat: string;
  telepon: string;
  email: string;
  deskripsi: string;
  statusPendaftaran: 'Buka' | 'Tutup';
  formFields: FormField[];
  persyaratanDaftarUlang?: string;
  tanggalDaftarUlang?: string;
  tanggalPengumuman?: string;
  logoSekolah?: string;
  kopSurat?: string;
  namaKepalaSekolah?: string;
  tandaTanganKepalaSekolah?: string;
  stempelSekolah?: string;
  tahunPendaftaran?: string;
  nomorSurat?: string;
  tempatSurat?: string;
  tanggalSurat?: string;
  nipKepalaSekolah?: string;
  catatanTambahan?: string;
  gambarHeaderBeranda?: string;
  koordinatSekolah?: string;
  tanggalCutoffUsia?: string;
  sambutanKepalaSekolah?: string;
  fotoKepalaSekolah?: string;
  visiSekolah?: string;
  misiSekolah?: string;
  panduanJudul?: string;
  panduanDeskripsi?: string;
  panduanPeringatan?: string;
  panduanDokumen?: PanduanDokumen[];
  panduanAlur?: string[];
}

export interface RegistrationData {
  [key: string]: any;
}

export interface AdminData extends RegistrationData {
  Timestamp: string;
  'No Pendaftaran': string;
  Status: 'Proses' | 'Lulus' | 'Tidak Lulus';
  'Alasan Penolakan'?: string;
}

/**
 * MOCK SETTINGS
 */

const getInitialMockSettings = (): AppSettings => {

  return {

    namaSekolah: "SDN Harapan Bangsa",

    alamat: "Jl. Pendidikan No. 123",

    telepon: "(021) 123456",

    email: "admin@sd.sch.id",

    deskripsi: "Website PPDB SD",

    statusPendaftaran: "Buka",

    formFields: [

      {
        id: "Nama Lengkap",
        label: "Nama Lengkap",
        type: "text",
        required: true
      },

      {
        id: "NIK",
        label: "NIK",
        type: "text",
        required: true
      },

      {
        id: "Tanggal Lahir",
        label: "Tanggal Lahir",
        type: "date",
        required: true
      }

    ]

  };

};

let mockSettings: AppSettings =
  getInitialMockSettings();

const saveMockSettings = (
  settings: AppSettings
) => {

  mockSettings = settings;

  localStorage.setItem(
    'mockSettings',
    JSON.stringify(settings)
  );

};

/**
 * MOCK DATA
 */

const getInitialMockData = (): AdminData[] => {

  return [];

};

let mockData: AdminData[] =
  getInitialMockData();

const saveMockData = (
  data: AdminData[]
) => {

  mockData = data;

  localStorage.setItem(
    'mockData',
    JSON.stringify(data)
  );

};

/**
 * GET SETTINGS
 */

export const getSettings = async (): Promise<AppSettings> => {

  if (!GAS_WEB_APP_URL) {

    await new Promise(resolve =>
      setTimeout(resolve, 500)
    );

    return { ...mockSettings };

  }

  try {

    const response = await fetch(
      `${GAS_WEB_APP_URL}?action=getSettings&t=${Date.now()}`
    );

    const result = await response.json();

    if (result.status === "success") {

      return {
        ...result.data,
        formFields:
          typeof result.data.formFields === 'string'
            ? JSON.parse(result.data.formFields)
            : result.data.formFields
      };

    }

    throw new Error(result.message);

  } catch (error) {

    console.error(
      "Error fetching settings:",
      error
    );

    throw error;

  }

};

/**
 * UPDATE SETTINGS
 */

export const updateSettings = async (
  settings: Partial<AppSettings>
) => {

  if (!GAS_WEB_APP_URL) {

    await new Promise(resolve =>
      setTimeout(resolve, 800)
    );

    saveMockSettings({
      ...mockSettings,
      ...settings
    });

    return {
      status: "success"
    };

  }

  try {

    const response = await fetch(
      GAS_WEB_APP_URL,
      {

        method: "POST",

        body: JSON.stringify({

          action: "updateSettings",

          adminSecret: ADMIN_SECRET,

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
 * SUBMIT REGISTRATION
 */

export const submitRegistration = async (
  data: RegistrationData
) => {

  if (!GAS_WEB_APP_URL) {

    await new Promise(resolve =>
      setTimeout(resolve, 1000)
    );

    const year =
      new Date().getFullYear();

    const newEntry: AdminData = {

      ...data,

      Timestamp:
        new Date().toISOString(),

      'No Pendaftaran':
        `SPMB-${year}-${String(mockData.length + 1).padStart(3, '0')}`,

      Status: 'Proses'

    };

    saveMockData([
      ...mockData,
      newEntry
    ]);

    return {
      status: "success",
      noPendaftaran:
        newEntry['No Pendaftaran']
    };

  }

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
 * GET REGISTRATIONS
 */

export const getRegistrations = async (): Promise<AdminData[]> => {

  if (!GAS_WEB_APP_URL) {

    await new Promise(resolve =>
      setTimeout(resolve, 1000)
    );

    return [...mockData];

  }

  try {

    const response = await fetch(
      `${GAS_WEB_APP_URL}?action=getRegistrations&adminSecret=${ADMIN_SECRET}&t=${Date.now()}`
    );

    const result = await response.json();

    if (result.status === "success") {
      return result.data;
    }

    throw new Error(result.message);

  } catch (error) {

    console.error(
      "Error fetching registrations:",
      error
    );

    throw error;

  }

};

/**
 * UPDATE STATUS
 */

export const updateStatus = async (
  noPendaftaran: string,
  newStatus: string,
  alasan?: string
) => {

  if (!GAS_WEB_APP_URL) {

    await new Promise(resolve =>
      setTimeout(resolve, 800)
    );

    const index =
      mockData.findIndex(
        d =>
          d['No Pendaftaran'] === noPendaftaran
      );

    if (index !== -1) {

      const newData = [...mockData];

      newData[index] = {

        ...newData[index],

        Status: newStatus as any

      };

      if (alasan !== undefined) {

        newData[index]['Alasan Penolakan'] =
          alasan;

      }

      saveMockData(newData);

      return {
        status: "success"
      };

    }

    throw new Error("Data not found");

  }

  try {

    const response = await fetch(
      GAS_WEB_APP_URL,
      {

        method: "POST",

        body: JSON.stringify({

          action: "updateStatus",

          adminSecret: ADMIN_SECRET,

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
 * CHECK STATUS
 */

export const checkStatus = async (
  noPendaftaran: string
) => {

  if (!GAS_WEB_APP_URL) {

    await new Promise(resolve =>
      setTimeout(resolve, 800)
    );

    const student =
      mockData.find(
        d =>
          d['No Pendaftaran'] === noPendaftaran
      );

    if (student) {

      return {

        status: "success",

        data: {

          noPendaftaran:
            student['No Pendaftaran'],

          namaLengkap:
            student['Nama Lengkap'],

          status:
            student.Status,

          alasanPenolakan:
            student['Alasan Penolakan']

        }

      };

    }

    return {
      status: "error",
      message: "Data tidak ditemukan"
    };

  }

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
 * LOGIN ADMIN
 */

export const loginAdmin = async (
  username: string,
  password: string
) => {

  if (!GAS_WEB_APP_URL) {

    await new Promise(resolve =>
      setTimeout(resolve, 800)
    );

    if (
      username === 'admin' &&
      password === 'admin123'
    ) {

      return {
        status: "success"
      };

    }

    return {
      status: "error",
      message:
        "Username atau password salah"
    };

  }

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
