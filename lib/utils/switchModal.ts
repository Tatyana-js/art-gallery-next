type RouterType = {
  replace: (url: string, options: { scroll: boolean }) => void;
};

type SwitchModalParams = {
  closeModal: () => void;
  openModal: () => void;
  type: 'login' | 'register';
  router: RouterType;
};

const switchModal = (params: SwitchModalParams) => {
  const { closeModal, openModal, type, router } = params;

  closeModal();
  const newUrl = `/auth/${type}`;

  router.replace(newUrl, { scroll: false }); 

  setTimeout(() => {
    openModal();
  }, 0);
};

export default switchModal;
