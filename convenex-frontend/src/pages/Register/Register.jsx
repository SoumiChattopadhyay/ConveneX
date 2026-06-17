import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const Register = () => {
  const { communityId, eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const fetchForm = async () => {
    await axios.get(`http://localhost:4000/api/community/${communityId}/event/${eventId}`, { withCredentials: true }).then((res) => {
      console.log(res);
      setEvent(res?.data?.event);
      setForm(res?.data?.event?.formId);//formId has the entire form as we populated it in controller
    }).catch((err) => {
      console.log(err);
      toast.error(err?.response?.data?.error);
    });
  };

  useEffect(() => {
    fetchForm();
  }, []);

  const handleChange = (fieldId, value) => {
    setAnswers({
      ...answers,
      [fieldId]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(answers);
    await axios.post(`http://localhost:4000/api/community/${communityId}/event/${eventId}/form/${form?._id}`, { answers }, { withCredentials: true }).then((res) => {
      const registration = res?.data?.registration;
      const razorpayOrder = res?.data?.razorpayOrder;
      const options = {
        key: `${import.meta.env.VITE_RAZORPAY_API_KEY_ID}`, // Replace with your Razorpay key_id
        amount: event?.entryFee * 100, // Amount is in currency subunits.
        currency: 'INR',
        name: 'Acme Corp',
        description: 'Test Transaction',
        order_id: `${razorpayOrder?.id}`, // razorpay objects use id not _id
        handler: async function (response) {
          try {
            console.log("Payment Success");
            console.log(response);
            await axios.post(`http://localhost:4000/api/community/event/${eventId}/verifyPayment`, { ...response, answers }, { withCredentials: true });
            window.location.href = `http://localhost:5173/community/${communityId}/event/${eventId}`;
          } catch (err) {
            console.log(err);
            console.log(err?.response?.data);
          }
        },
        prefill: {
          name: `${answers?.[form?.fields?.find((field) => field.type === "Text")?.fieldId] || ""}`,
          email: `${answers?.[form?.fields?.find((field) => field.type === "Email")?.fieldId] || ""}`,
          // contact: `${event?.organizer?.contact}`
        },
        theme: {
          color: '#F37254'
        },
      };
      if (event?.entryFee > 0) {
        const rzp = new Razorpay(options);
        rzp.open();
      } else {
        toast.success("Registered Successfully");
        setTimeout(() => {
          window.location.href =
            `http://localhost:5173/community/${communityId}/event/${eventId}`;
        }, 1000);
      }
    }).catch((err) => {
      console.log(err);
      toast.error(err?.response?.data?.error);
    });
  };


  return (
    <div className='bg-[#f5f2f7] p-5 w-full relative'>
      <div className='max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8'>

        <h1 className='text-3xl font-semibold mb-8 text-center'>
          Event Registration
        </h1>

        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-6'
        >

          {
            form?.fields?.map((field) => {

              return (

                <div
                  key={field.fieldId}
                  className='flex flex-col gap-2'
                >

                  <label className='font-medium text-gray-700'>

                    {field.label}

                    {
                      field.required &&
                      <span className='text-red-600 ml-1'>
                        *
                      </span>
                    }

                  </label>

                  {/* TEXT */}
                  {
                    field.type === "Text" && (

                      <input
                        type="text"
                        placeholder={`Enter ${field.label}`}
                        className='border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500'
                        required={field.required}
                        onChange={(e) =>
                          handleChange(
                            field.fieldId,
                            e.target.value
                          )
                        }
                      />
                    )
                  }

                  {/* TEXTAREA */}
                  {
                    field.type === "Textarea" && (

                      <textarea
                        placeholder={`Enter ${field.label}`}
                        className='border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500 min-h-28'
                        required={field.required}
                        onChange={(e) =>
                          handleChange(
                            field.fieldId,
                            e.target.value
                          )
                        }
                      />
                    )
                  }

                  {/* EMAIL */}
                  {
                    field.type === "Email" && (

                      <input
                        type="email"
                        placeholder={`Enter ${field.label}`}
                        className='border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500'
                        required={field.required}
                        onChange={(e) =>
                          handleChange(
                            field.fieldId,
                            e.target.value
                          )
                        }
                      />
                    )
                  }

                  {/* NUMBER */}
                  {
                    field.type === "Number" && (

                      <input
                        type="number"
                        placeholder={`Enter ${field.label}`}
                        className='border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500'
                        required={field.required}
                        onChange={(e) =>
                          handleChange(
                            field.fieldId,
                            e.target.value
                          )
                        }
                      />
                    )
                  }

                  {/* SELECT */}
                  {
                    field.type === "Select" && (

                      <select
                        className='border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500'
                        required={field.required}
                        onChange={(e) =>
                          handleChange(
                            field.fieldId,
                            e.target.value
                          )
                        }
                      >

                        <option value="">
                          Select Option
                        </option>

                        {
                          field.options.map(
                            (option, index) => (

                              <option
                                key={index}
                                value={option}
                              >
                                {option}
                              </option>
                            )
                          )
                        }

                      </select>
                    )
                  }

                </div>
              );
            })
          }

          <button
            type='submit'
            className='bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 text-white py-3 rounded-xl font-medium mt-4 cursor-pointer'
          >
            Register For Event
          </button>

        </form>

      </div>
      <ToastContainer />
    </div>
  )
}

export default Register