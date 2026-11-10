import React from 'react';
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from 'vitest';
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
  act,
} from '@testing-library/react';
import emailjs from '@emailjs/browser';
import Contact from '../components/Contact';

vi.mock('@emailjs/browser', () => ({
  default: {
    send: vi.fn(),
  },
}));

/**
 * Populates the contact form with supplied or default values.
 *
 * @param {Object} values - Optional form values.
 * @returns {void}
 */
function fillForm({
  name = 'Test Visitor',
  email = '',
  message = 'Hello from the portfolio.',
} = {}) {
  fireEvent.change(screen.getByLabelText('Name'), {
    target: { value: name },
  });

  fireEvent.change(screen.getByLabelText('Email (optional)'), {
    target: { value: email },
  });

  fireEvent.change(screen.getByLabelText('Message'), {
    target: { value: message },
  });
}

describe('Contact', () => {
  beforeEach(() => {
    emailjs.send.mockReset();
    emailjs.send.mockResolvedValue({ status: 200 });

    vi.stubEnv('VITE_EMAILJS_SERVICE_ID', 'test-service');
    vi.stubEnv('VITE_EMAILJS_TEMPLATE_ID', 'test-template');
    vi.stubEnv('VITE_EMAILJS_PUBLIC_KEY', 'test-public-key');
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
  });

  it('requires name and message but makes email optional', () => {
    render(<Contact header="Contact" />);

    expect(screen.getByLabelText('Name')).toBeRequired();
    expect(screen.getByLabelText('Message')).toBeRequired();
    expect(
      screen.getByLabelText('Email (optional)'),
    ).not.toBeRequired();
  });

  it('sends a message without an email address', async () => {
    render(<Contact header="Contact" />);
    fillForm();

    fireEvent.click(
      screen.getByRole('button', { name: 'Send message' }),
    );

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'Your message has been sent successfully.',
      );
    });

    expect(emailjs.send).toHaveBeenCalledTimes(1);
    expect(emailjs.send).toHaveBeenCalledWith(
      'test-service',
      'test-template',
      {
        from_name: 'Test Visitor',
        reply_to: '',
        message: 'Hello from the portfolio.',
      },
      {
        publicKey: 'test-public-key',
      },
    );
  });

  it('trims values and includes the optional email', async () => {
    render(<Contact header="Contact" />);

    fillForm({
      name: '  Test Visitor  ',
      email: 'visitor@example.com',
      message: '  Please contact me.  ',
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Send message' }),
    );

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'Your message has been sent successfully.',
      );
    });

    expect(emailjs.send).toHaveBeenCalledWith(
      'test-service',
      'test-template',
      {
        from_name: 'Test Visitor',
        reply_to: 'visitor@example.com',
        message: 'Please contact me.',
      },
      {
        publicKey: 'test-public-key',
      },
    );
  });

  it('rejects a whitespace-only name', () => {
    render(<Contact header="Contact" />);
    fillForm({ name: '   ' });

    fireEvent.click(
      screen.getByRole('button', { name: 'Send message' }),
    );

    expect(emailjs.send).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Please enter your name and message.',
    );
  });

  it('rejects a whitespace-only message', () => {
    render(<Contact header="Contact" />);
    fillForm({ message: '   ' });

    fireEvent.click(
      screen.getByRole('button', { name: 'Send message' }),
    );

    expect(emailjs.send).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Please enter your name and message.',
    );
  });

  it('rejects an incorrectly formatted email', () => {
    render(<Contact header="Contact" />);
    fillForm({ email: 'invalid-email' });

    const emailInput = screen.getByLabelText('Email (optional)');

    expect(emailInput.validity.typeMismatch).toBe(true);

    fireEvent.click(
      screen.getByRole('button', { name: 'Send message' }),
    );

    expect(emailjs.send).not.toHaveBeenCalled();
  });

  it('clears the form after successful submission', async () => {
    render(<Contact header="Contact" />);
    fillForm({ email: 'visitor@example.com' });

    fireEvent.click(
      screen.getByRole('button', { name: 'Send message' }),
    );

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'Your message has been sent successfully.',
      );
    });

    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(screen.getByLabelText('Email (optional)')).toHaveValue('');
    expect(screen.getByLabelText('Message')).toHaveValue('');
    expect(
      screen.getByRole('button', { name: 'Send message' }),
    ).toBeEnabled();
  });

  it('preserves form values when sending fails', async () => {
    emailjs.send.mockRejectedValueOnce(
      new Error('Service unavailable'),
    );

    render(<Contact header="Contact" />);
    fillForm({ email: 'visitor@example.com' });

    fireEvent.click(
      screen.getByRole('button', { name: 'Send message' }),
    );

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'Unable to send your message.',
      );
    });

    expect(screen.getByLabelText('Name')).toHaveValue(
      'Test Visitor',
    );
    expect(screen.getByLabelText('Email (optional)')).toHaveValue(
      'visitor@example.com',
    );
    expect(screen.getByLabelText('Message')).toHaveValue(
      'Hello from the portfolio.',
    );
    expect(
      screen.getByRole('button', { name: 'Send message' }),
    ).toBeEnabled();
  });

  it('disables submission while sending', async () => {
    let resolveSend;

    const pendingRequest = new Promise((resolve) => {
      resolveSend = resolve;
    });

    emailjs.send.mockReturnValueOnce(pendingRequest);

    render(<Contact header="Contact" />);
    fillForm();

    fireEvent.click(
      screen.getByRole('button', { name: 'Send message' }),
    );

    const sendingButton = screen.getByRole('button', {
      name: 'Sending...',
    });

    expect(sendingButton).toBeDisabled();

    fireEvent.click(sendingButton);

    expect(emailjs.send).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveSend({ status: 200 });
      await pendingRequest;
    });

    expect(screen.getByRole('status')).toHaveTextContent(
      'Your message has been sent successfully.',
    );
  });
});
