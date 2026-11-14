import { Router } from 'express';
import { handler as listUseCasesHandler } from '../../useCaseBuilder/listUseCases';
import { handler as listFavoriteUseCasesHandler } from '../../useCaseBuilder/listFavoriteUseCases';
import { handler as getUseCaseHandler } from '../../useCaseBuilder/getUseCase';
import { handler as createUseCaseHandler } from '../../useCaseBuilder/createUseCase';
import { handler as updateUseCaseHandler } from '../../useCaseBuilder/updateUseCase';
import { handler as deleteUseCaseHandler } from '../../useCaseBuilder/deleteUseCase';
import { handler as toggleFavoriteHandler } from '../../useCaseBuilder/toggleFavorite';
import { handler as toggleSharedHandler } from '../../useCaseBuilder/toggleShared';
import { handler as listRecentlyUsedUseCasesHandler } from '../../useCaseBuilder/listRecentlyUsedUseCases';
import { handler as updateRecentlyUsedUseCaseHandler } from '../../useCaseBuilder/updateRecentlyUsedUseCase';

export const router = Router();

router.get('/', listUseCasesHandler);
router.get('/favorite', listFavoriteUseCasesHandler);
router.get('/recent', listRecentlyUsedUseCasesHandler);
router.put('/recent/:useCaseId', updateRecentlyUsedUseCaseHandler);
router.get('/:useCaseId', getUseCaseHandler);
router.post('/', createUseCaseHandler);
router.put('/:useCaseId', updateUseCaseHandler);
router.delete('/:useCaseId', deleteUseCaseHandler);
router.put('/:useCaseId/favorite', toggleFavoriteHandler);
router.put('/:useCaseId/shared', toggleSharedHandler);
