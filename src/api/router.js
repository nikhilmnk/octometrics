import express from 'express';
import { statsController } from '../controllers/statsController.js';
import { languagesController } from '../controllers/languagesController.js';
import { reposController } from '../controllers/reposController.js';
import { bannerController } from '../controllers/bannerController.js';
import { typingController } from '../controllers/typingController.js';
import {
  badgeController,
  customBadgeController,
} from '../controllers/badgeController.js';
import { contributionController } from '../controllers/contributionController.js';
import { dashboardController } from '../controllers/dashboardController.js';
import { streakController } from '../controllers/streakController.js';

const router = express.Router();

// Register API endpoints
router.get('/stats', statsController);
router.get('/languages', languagesController);
router.get('/repos', reposController);
router.get('/banner', bannerController);
router.get('/typing', typingController);
router.get('/streak', streakController);
router.get('/badge/:badge', customBadgeController);
router.get('/badges/:type', badgeController);
router.get('/contributions', contributionController.getContributions);
router.get('/contributions3d', contributionController.getContributions3D);
router.get('/dashboard', dashboardController);

export { router };
