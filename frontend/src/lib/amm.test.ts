import { describe, it, expect, vi } from 'vitest';
import { normalizeAddress, sortTokenAddresses } from './amm';
import { isAddress, getAddress } from 'ethers';

// Mock ethers utils if necessary, but ideally we test integration with them or assume they work.
// Since we are writing unit tests for our wrappers, we can just call them.
// However, in a real environment without ethers installed in the test environment, this would fail.
// But we assume the dev environment will have deps installed.

describe('AMM Helpers', () => {
  describe('normalizeAddress', () => {
    it('should normalize a valid address', () => {
      const validAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
      const normalized = getAddress(validAddress); // Expected output from ethers
      
      expect(normalizeAddress(validAddress)).toBe(normalized);
    });

    it('should normalize a valid address with whitespace', () => {
      const validAddress = ' 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 ';
      const normalized = getAddress(validAddress.trim());
      
      expect(normalizeAddress(validAddress)).toBe(normalized);
    });

    it('should throw an error for an invalid address', () => {
      const invalidAddress = '0xinvalid';
      expect(() => normalizeAddress(invalidAddress)).toThrow(`Invalid address: ${invalidAddress}`);
    });
  });

  describe('sortTokenAddresses', () => {
    it('should sort tokens correctly', () => {
      // Token A < Token B numerically
      const tokenA = '0x1000000000000000000000000000000000000000';
      const tokenB = '0x2000000000000000000000000000000000000000';

      const result = sortTokenAddresses(tokenA, tokenB);
      expect(result.token0).toBe(getAddress(tokenA));
      expect(result.token1).toBe(getAddress(tokenB));
    });

    it('should sort tokens correctly when order is reversed', () => {
      // Token A > Token B numerically
      const tokenA = '0x2000000000000000000000000000000000000000';
      const tokenB = '0x1000000000000000000000000000000000000000';

      const result = sortTokenAddresses(tokenA, tokenB);
      expect(result.token0).toBe(getAddress(tokenB));
      expect(result.token1).toBe(getAddress(tokenA));
    });

    it('should throw an error if addresses are identical', () => {
      const token = '0x1000000000000000000000000000000000000000';
      expect(() => sortTokenAddresses(token, token)).toThrow('Token addresses must be different');
    });
  });
});
