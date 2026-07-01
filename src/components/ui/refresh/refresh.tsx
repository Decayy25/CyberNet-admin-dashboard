
interface RefreshProps {
    onClick: () => void;
}
const Refresh = (props: RefreshProps) => {
  return (
    <button
      className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-lg shadow-blue-600/10"
      onClick={props.onClick}
    >
      Refresh
    </button>
  );
};

export default Refresh;
