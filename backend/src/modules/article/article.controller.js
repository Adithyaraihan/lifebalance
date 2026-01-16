import { findArticle } from "./article.service.js";

export const getArticleController = async (req, res) => {
  try {
    const daftarJurnal = await findArticle();

    res.status(200).send(daftarJurnal);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data jurnal." });
  }
};
