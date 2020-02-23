import {ShowModal, FlashInfo} from '../plugin/Provider'

declare module "*.jpeg";
declare module "*.jpg";
declare module "*.png";
declare module "*.svg";

declare global {
  interface Window {
    playground: {
      ui: {
        showModal: ShowModal;
        flashInfo: FlashInfo;
      };
    };
    ts: typeof window.ts
  }
}
