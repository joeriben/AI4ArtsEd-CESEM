# TODO: WeasyPrint Upgrade

## Status: TEMPORÄRER DOWNGRADE

### Was wurde gemacht?
- WeasyPrint von Version 66.0 auf 60.2 downgraded
- Datum: 2025-11-20

### Warum?
- WeasyPrint 66.0 hat Breaking Changes in der API
- Fehlermeldung: "PDF.__init__() takes 1 positional argument but 3 were given"
- Der bestehende Code in `server/my_app/services/export_manager.py` (Zeile 733-759) ist mit Version 66.0 inkompatibel

### Betroffener Code
**Datei:** `server/my_app/services/export_manager.py`
**Methode:** `generate_export_pdf()` (Zeile 716-769)

```python
# Zeile 733-759: CSS und PDF-Generierung
css = CSS(string="""...""")
pdf = HTML(string=html_content).write_pdf(stylesheets=[css])
```

### Was muss später gemacht werden?

1. **Code an WeasyPrint 66.0+ API anpassen:**
   - Neue API-Dokumentation prüfen: https://doc.courtbouillon.org/weasyprint/stable/
   - CSS-Übergabe überprüfen und ggf. anpassen
   - PDF-Generierung an neue write_pdf() Signatur anpassen

2. **Nach Anpassung:**
   ```bash
   pip install --upgrade weasyprint
   python3 -c "import weasyprint; print(weasyprint.__version__)"  # Sollte >= 66.0 sein
   ```

3. **Test durchführen:**
   - PDF-Export testen (Auto-Export und manueller Export)
   - Alle Export-Formate verifizieren (HTML, PDF, XML, DOCX)

### Aktuelle Version (stabil)
```
weasyprint==60.2
```

### Installationsbefehl für Downgrade (falls nötig)
```bash
pip uninstall weasyprint -y
pip install weasyprint==60.2
```

---
**Notiz:** Dieser Downgrade ist eine sichere, temporäre Lösung für das Production-System. Die Code-Anpassung sollte in einer Test-Umgebung erfolgen.
