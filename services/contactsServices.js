import Contact from "../db/models/Contacts.js";
import { Op } from "sequelize";

export async function listContacts(
  query = {},
  { page = 1, limit = 20, favorite = null }
) {
  const normalizedLimit = Number(limit);
  const offset = (Number(page) - 1) * normalizedLimit;
  const favoriteParsed = favorite === "true" ? true : false;

  if (!!favorite) {
    if (favoriteParsed) {
      return await Contact.findAll({
        order: [["favorite", "DESC"]],
        where: query,
        offset,
        limit: normalizedLimit,
      });
    } else {
      return await Contact.findAll({
        order: [["favorite", "ASC"]],
        where: query,
        offset,
        limit: normalizedLimit,
      });
    }
  }

  return await Contact.findAll({
    where: query,
    offset,
    limit: normalizedLimit,
  });
}

export async function getContactById(query) {
  const result = Contact.findOne({
    where: query,
  });

  return result;
}

export async function addContact(data) {
  const newContact = await Contact.build(data);

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
  const contact = await getContactById(query);
  if (!contact) {
    return null;
  }

  return contact.update(data, {
    returning: true,
  });
}

export async function updateStatusContact(data, query) {
  const contact = await getContactById(query);
  if (!contact) {
    return null;
  }

  return contact.update(
    { favorite: data["favorite"] },
    {
      where: {
        query,
      },
      returning: true,
    }
  );
}
