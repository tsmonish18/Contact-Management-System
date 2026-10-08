import axios from "axios";
import { useState, useEffect } from "react";

function ContactList({ setContacts, contacts }) {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);

      try {
        const query = `?status=${filter}&search=${search}`;

        const res = await axios.get(
          `http://localhost:5000/api/contacts${query}`
        );

        setContacts(res.data);

        // Keep loading screen for 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (err) {
        console.log("Error fetching contacts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [filter, search, setContacts]);

  // Change contact status
  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/contacts/${id}`,
        { status }
      );

      setContacts((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, status } : c
        )
      );
    } catch (err) {
      console.log("Error updating status:", err);
    }
  };

  // Delete contact
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/contacts/${id}`
        );

        setContacts((prev) =>
          prev.filter((c) => c._id !== id)
        );
      } catch (err) {
        console.log("Error deleting contact:", err);
      }
    }
  };

  return (
    <>
      {/* Search and Filter */}
      <div className="flex gap-4">
        <select
          className="p-2 rounded bg-[#00277a] text-white cursor-pointer outline-0"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Interested">Interested</option>
          <option value="Follow Up">Follow Up</option>
          <option value="Closed">Closed</option>
        </select>

        <input
          type="text"
          placeholder="Search by name or company"
          className="p-3 rounded w-full bg-[#eff4ff] outline-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="w-full h-[415px] flex flex-col items-center justify-center rounded-[5px] p-[20px] mt-10 gap-4">
          <img
            src="/Loading.svg.gif"
            alt="Loading"
            width={60}
            height={60}
          />

          <p className="text-[#00277a] text-2xl font-semibold">
            Loading...
          </p>
        </div>
      ) : (
        <>
          {/* No contacts */}
          {contacts.length === 0 ? (
            <div className="w-full h-[415px] flex flex-col items-center justify-center rounded-[5px] p-[20px] mt-10 gap-4 bg-[#eff4ff]">
              <img
                src="/contacts-not-found.png"
                alt="Contacts not found"
                width={200}
                height={200}
              />

              <p className="text-[#00277a] text-2xl font-semibold">
                No contacts found.
              </p>
            </div>
          ) : (
            /* Contact cards */
            <div className="grid grid-cols-2 gap-10 mt-10">
              {contacts.map((c) => (
                <div key={c._id}>
                  <div className="bg-[#eff4ff] shadow-md rounded p-4 flex flex-col justify-between hover:shadow-lg transition">

                    {/* Contact information */}
                    <div>
                      <div className="text-gray-500 text-sm flex gap-2 mb-5 mt-0 justify-between items-center">

                        <h3 className="font-bold text-2xl text-[#00277a]">
                          {c.name}
                        </h3>

                        <p className="text-[#00277a] p-2 px-4 rounded bg-[#d3e6ff] font-medium">
                          {c.company}
                        </p>

                      </div>

                      <div className="text-[16px] flex gap-2 my-3 justify-between border-2 border-[#00277a21] px-3 p-3 rounded">
                        <p>📧 {c.email}</p>
                        <p>📞 {c.phone}</p>
                      </div>
                    </div>

                    {/* Status and Delete */}
                    <div className="flex justify-between items-center mt-4">

                      <select
                        value={c.status}
                        className="p-1 rounded cursor-pointer outline-0 shadow"
                        onChange={(e) =>
                          handleStatusChange(
                            c._id,
                            e.target.value
                          )
                        }
                      >
                        <option value="Interested">
                          Interested
                        </option>

                        <option value="Follow Up">
                          Follow Up
                        </option>

                        <option value="Closed">
                          Closed
                        </option>
                      </select>

                      <button
                        onClick={() => handleDelete(c._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition cursor-pointer"
                      >
                        Delete
                      </button>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default ContactList;