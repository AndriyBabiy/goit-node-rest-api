import Contact from "../db/models/Contacts.js";
export async function listContacts(query = {}) {
  return Contact.findAll({
    where: query,
  });
}

export async function getContactById(query) {
  const num_id = Number(query.id);

  const result = Contact.findOne({
    where: {
      id: num_id,
      // owner: query.owner,
    },
  });

  return result;
}

export async function addContact(data) {
  console.log(data);

  const newContact = await Contact.build(data);

  console.log(newContact);

  return newContact.save();
}

export async function removeContact(query) {
  const contactDeleted = getContactById(query);

  Contact.destroy({
    where: {
      query,
    },
  });

  return contactDeleted;
}

export async function updateContact(data, query) {
  await Contact.update(data, {
    where: {
      query,
    },
  });

  return getContactById(id);
}

export async function updateStatusContact(data, query) {
  await Contact.update(
    { favorite: data["favorite"] },
    {
      where: {
        query,
      },
    }
  );

  return getContactById(id);
}
