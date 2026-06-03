import { getSettings, updateSettings } from '../../services/loyalty/settings.service.js';

export async function fetchSettings(req, res) {
  const settings = await getSettings();
  res.json(settings);
}

export async function saveSettings(req, res) {
  const updated = await updateSettings(req.body);
  res.json(updated);
}
