import { Router, Request, Response } from 'express';
import {
  CreateUseCaseRequest,
  UpdateUseCaseRequest,
} from 'generative-ai-use-cases';
import {
  createUseCase,
  deleteUseCase,
  getUseCase,
  listFavoriteUseCases,
  listRecentlyUsedUseCases,
  listUseCases,
  toggleFavorite,
  toggleShared,
  updateRecentlyUsedUseCase,
  updateUseCase,
} from '../../useCaseBuilder/useCaseBuilderRepository';
import { getUserId } from '../user';

export const router = Router();

const exclusiveStartKeyOf = (req: Request) =>
  req.query.exclusiveStartKey as string | undefined;

router.get('/', async (req: Request, res: Response) => {
  try {
    const useCases = await listUseCases(
      getUserId(req),
      exclusiveStartKeyOf(req)
    );
    res.status(200).json(useCases);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/favorite', async (req: Request, res: Response) => {
  try {
    const useCases = await listFavoriteUseCases(
      getUserId(req),
      exclusiveStartKeyOf(req)
    );
    res.status(200).json(useCases);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/recent', async (req: Request, res: Response) => {
  try {
    const useCases = await listRecentlyUsedUseCases(
      getUserId(req),
      exclusiveStartKeyOf(req)
    );
    res.status(200).json(useCases);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/recent/:useCaseId', async (req: Request, res: Response) => {
  try {
    await updateRecentlyUsedUseCase(getUserId(req), req.params.useCaseId);
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:useCaseId', async (req: Request, res: Response) => {
  try {
    const useCase = await getUseCase(getUserId(req), req.params.useCaseId);
    if (!useCase) {
      res.status(404).json({ message: 'Use case not found' });
      return;
    }
    res.status(200).json(useCase);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const input: CreateUseCaseRequest = req.body;
    const useCase = await createUseCase(getUserId(req), input);
    res.status(200).json(useCase);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/:useCaseId', async (req: Request, res: Response) => {
  try {
    const input: UpdateUseCaseRequest = req.body;
    await updateUseCase(getUserId(req), req.params.useCaseId, input);
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/:useCaseId', async (req: Request, res: Response) => {
  try {
    await deleteUseCase(getUserId(req), req.params.useCaseId);
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/:useCaseId/favorite', async (req: Request, res: Response) => {
  try {
    const isFavorite = await toggleFavorite(
      getUserId(req),
      req.params.useCaseId
    );
    res.status(200).json(isFavorite);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/:useCaseId/shared', async (req: Request, res: Response) => {
  try {
    const isShared = await toggleShared(getUserId(req), req.params.useCaseId);
    res.status(200).json(isShared);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
