import Contact from "../db/models/Contacts.js";
export async function listContacts() {
  return Contact.findAll();
}

export async function getContactById(id) {
  const result = Contact.findOne({
    where: {
      id,
    },
  });

  return result;
}

export async function addContact(data) {
  const newContact = Contact.build(data);

  return newContact.save();
}

export async function removeContact(id) {
  const contactDeleted = getContactById(id);

  Contact.destroy({
    where: {
      id,
    },
  });

  return contactDeleted;
}

export async function updateContact(id, data) {
  await Contact.update(data, {
    where: {
      id,
    },
  });

  return getContactById(id);
}

export async function updateStatusContact(id, data) {
  await Contact.update(
    { favorite: data["favorite"] },
    {
      where: {
        id,
      },
    }
  );

  return getContactById(id);
}
