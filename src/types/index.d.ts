declare module "*.jpeg";
declare module "*.jpg";
declare module "*.png";
declare module "*.svg";

declare global {
  interface Window {
    playground: {
      ui: {
        showModal: any;
        flashInfo: (message: string) => void;
      };
    };
  }
}
