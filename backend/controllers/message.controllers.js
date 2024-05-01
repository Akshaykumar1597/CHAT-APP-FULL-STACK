import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id; //to access this userId we need to have middleware between the routes
    console.log(senderId);

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // Socket IO FUNCTIONALITY WILL GO HERE 

    //await conversation.save(); //Here we need to run parallel
    //await newMessage.save();

    //This will run in parallel
    await Promise.all([conversation.save(), newMessage.save()])
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in message controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessages = async (req,res)=>{
  try {
    
    const {id : userToChatId} = req.params;
    const senderId = req.user._id;
 
    let conversation = await Conversation.findOne({
      participants: {$all: [senderId, userToChatId]},
    }).populate("messages"); //mongoose prvoides the populate method to add the all the messages from db in form of object rahter a copy

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json(messages);

  } catch (error) {
    console.log("Error in getMessages controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
