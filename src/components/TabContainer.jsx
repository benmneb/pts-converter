export default function TabContainer(props) {
  const { children, index, value } = props;

  return (
    <section
      id={`tabcontainer-${index}`}
      hidden={value !== index}
      className="tabContainer"
    >
      {value === index && children}
    </section>
  );
}
