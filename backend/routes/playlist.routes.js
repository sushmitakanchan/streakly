import express, { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getAllListDetails, getPlaylistDetails, createPlaylist, addProblemToPlaylist, deletePlaylist, removeProblemFromPlaylist } from "../controllers/playlist.controller.js";

 const playlistRoutes = express.Router();

 playlistRoutes.get("/", authMiddleware, getAllListDetails);
 playlistRoutes.get('/:playlistId', authMiddleware, getPlaylistDetails);
 playlistRoutes.post("/create-playlist", authMiddleware, createPlaylist);
 playlistRoutes.post("/:playlistId/add-problem", authMiddleware, addProblemToPlaylist);
 playlistRoutes.delete("/:playlistId", authMiddleware, deletePlaylist);
 playlistRoutes.delete("/:playlistId/removeProblem", authMiddleware, removeProblemFromPlaylist)

 export default playlistRoutes;

