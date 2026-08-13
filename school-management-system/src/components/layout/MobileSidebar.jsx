import Sidebar from "./Sidebar";

function MobileSidebar({ isOpen, onClose }) {
  return (
    <Sidebar
      isOpen={isOpen}
      onClose={onClose}
    />
  );
}

export default MobileSidebar;