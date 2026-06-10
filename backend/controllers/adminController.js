import User from '../models/User.js';
import Cafe from '../models/Cafe.js';
import Review from '../models/Review.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json({ success: true, data: users });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Rol inválido' });
  }

  const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
  if (!user) {
    return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  }

  res.status(200).json({ success: true, data: user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  }
  res.status(200).json({ success: true, message: 'Usuario eliminado correctamente' });
});

export const getAllCafes = asyncHandler(async (req, res) => {
  const cafes = await Cafe.find().populate('reviews');
  res.status(200).json({ success: true, data: cafes });
});

export const createCafe = asyncHandler(async (req, res) => {
  const cafe = new Cafe(req.body);
  await cafe.save();
  res.status(201).json({ success: true, data: cafe });
});

export const updateCafe = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cafe = await Cafe.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  if (!cafe) {
    return res.status(404).json({ success: false, message: 'Café no encontrado' });
  }
  res.status(200).json({ success: true, data: cafe });
});

export const deleteCafe = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cafe = await Cafe.findByIdAndDelete(id);
  if (!cafe) {
    return res.status(404).json({ success: false, message: 'Café no encontrado' });
  }
  res.status(200).json({ success: true, message: 'Café eliminado correctamente' });
});

export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find().populate('user cafe');
  res.status(200).json({ success: true, data: reviews });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const review = await Review.findByIdAndDelete(id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Reseña no encontrada' });
  }
  res.status(200).json({ success: true, message: 'Reseña eliminada correctamente' });
});
