import React from 'react';
import {
  describe, it, expect, vi, beforeEach, afterEach,
} from 'vitest';
import {
  render, screen, fireEvent, cleanup,
} from '@testing-library/react';
import Projects from '../components/Projects';

// Animation is checked manually; these tests focus on page behaviour.
vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
  },
}));

vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn(),
}));

const projects = [
  {
    title: 'Portfolio Website',
    bodyText: 'A personal website with responsive pages.',
    tags: ['React', 'JavaScript'],
  },
  {
    title: 'Legacy Migration',
    bodyText: 'Moves reporting workflows to a new platform.',
    tags: ['Python', 'SQL'],
  },
  {
    title: 'Quality Monitor',
    bodyText: 'Detects anomalies in revenue data.',
    tags: ['Python'],
  },
];

/**
 * Renders the page and waits for the mocked project data.
 *
 * @returns {Promise<void>}
 */
async function renderLoadedProjects() {
  render(<Projects header="Projects" />);
  await screen.findByRole('heading', { name: 'Portfolio Website' });
}

describe('Projects', () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ projects }),
    });

    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('loads and displays the projects', async () => {
    await renderLoadedProjects();

    expect(
      screen.getByRole('heading', { name: 'Legacy Migration' }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Quality Monitor' }),
    ).toBeInTheDocument();

    expect(screen.getByRole('status')).toHaveTextContent('3 projects found');
    expect(screen.getByRole('button', { name: 'Clear' })).toBeDisabled();
  });

  it.each([
    ['title', 'LEGACY', 'Legacy Migration'],
    ['description', 'ANOMALIES', 'Quality Monitor'],
    ['tag', 'jAvAsCrIpT', 'Portfolio Website'],
  ])('searches by %s without case sensitivity', async (
    field,
    query,
    expectedTitle,
  ) => {
    await renderLoadedProjects();

    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Search projects' }),
      { target: { value: query } },
    );

    expect(
      screen.getByRole('heading', { name: expectedTitle }),
    ).toBeInTheDocument();

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveTextContent('1 project found');
  });

  it('filters projects by technology', async () => {
    await renderLoadedProjects();

    fireEvent.change(
      screen.getByRole('combobox', { name: 'Filter by technology' }),
      { target: { value: 'Python' } },
    );

    expect(
      screen.queryByRole('heading', { name: 'Portfolio Website' }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Legacy Migration' }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Quality Monitor' }),
    ).toBeInTheDocument();

    expect(screen.getByRole('status')).toHaveTextContent('2 projects found');
  });

  it('applies search and technology filtering together', async () => {
    await renderLoadedProjects();

    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Search projects' }),
      { target: { value: 'revenue' } },
    );

    fireEvent.change(
      screen.getByRole('combobox', { name: 'Filter by technology' }),
      { target: { value: 'Python' } },
    );

    expect(
      screen.getByRole('heading', { name: 'Quality Monitor' }),
    ).toBeInTheDocument();

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(1);

    // A React filter excludes the matching Python project.
    fireEvent.change(
      screen.getByRole('combobox', { name: 'Filter by technology' }),
      { target: { value: 'React' } },
    );

    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0);
    expect(screen.getByText(/No matching projects/)).toBeInTheDocument();
  });

  it('clears search and filters and restores all projects', async () => {
    await renderLoadedProjects();

    const searchInput = screen.getByRole('searchbox', {
      name: 'Search projects',
    });
    const tagSelect = screen.getByRole('combobox', {
      name: 'Filter by technology',
    });

    fireEvent.change(searchInput, { target: { value: 'legacy' } });
    fireEvent.change(tagSelect, { target: { value: 'Python' } });

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(searchInput).toHaveValue('');
    expect(tagSelect).toHaveValue('');
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
    expect(screen.getByRole('status')).toHaveTextContent('3 projects found');
    expect(screen.getByRole('button', { name: 'Clear' })).toBeDisabled();
  });

  it('shows an error when the server returns an unsuccessful response', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<Projects header="Projects" />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Unable to load projects.',
    );
  });

  it('shows an error when the request fails', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network unavailable'));

    render(<Projects header="Projects" />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Unable to load projects.',
    );
  });

  it('shows an error when the projects data has an invalid structure', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ projects: null }),
    });

    render(<Projects header="Projects" />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Unable to load projects.',
    );
  });
});
