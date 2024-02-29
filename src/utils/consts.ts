import path from "path";

export const SWIFTI_DIR = path.join(process.cwd(), ".swifti");
export const ROUTES_DIR = path.join(SWIFTI_DIR, "routes");
export const ROUTES_FILE_DIR = path.join(SWIFTI_DIR, "routes.js");
export const MAIN_FILE_DIR = path.join(SWIFTI_DIR, "main.js");
export const SETUP_FILE_DIR = path.join(SWIFTI_DIR, "setup.js");
export const PROJECT_DIR = path.join(process.cwd(), "src");
