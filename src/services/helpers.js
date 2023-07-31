export const splitRoute = (pathname) => {
  const url = pathname.split("/")[1];
  return "/" + url;
};

export const unique = () => {
  const min = 10000;
  const max = 90000;
  const num = Math.floor(Math.random() * max) + min;
  return num;
};

export const inputTypes = [
  { key: "text", label: "Text" },
  { key: "textarea", label: "Textarea" },
  { key: "select", label: "Select" },
  { key: "file", label: "File" },
  { key: "number", label: "Number" },
  { key: "password", label: "Password" },
  { key: "email", label: "Email" },
  { key: "checkbox", label: "Checkbox" },
  { key: "radio", label: "Radio" },
];

export const configGroups = [
  { key: "site", label: "Site" },
  { key: "admin", label: "Admin" },
];

export const splitDetails = (txt) => {
  const arrs = txt.split(",");
  const options = [];

  arrs.forEach((el) => {
    const inner = el.split(":");
    const list = {
      key: inner[0],
      label: inner[1],
    };

    options.push(list);
  });

  return options;
};