import express from 'express';

export const ROUTER_INIT_STUB = jest.fn().mockImplementation(function() {
  return express.Router();
})