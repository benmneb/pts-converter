export default function TabContainer(props) {
  const { children, index, value } = props;

  return (
    <div
      id={`tabcontainer-${index}`}
      hidden={value !== index}
      className="tabContainer"
    >
      {value === index && children}
    </div>
  );
}
