<?php

namespace CoreX\AIMindLayer;

use Composer\Plugin\Capability\CommandProvider;
use Composer\Command\BaseCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Stellt Composer-Befehle für coreX AI MindLayer bereit
 */
class ComposerCommandProvider implements CommandProvider
{
    /**
     * Gibt die verfügbaren Commands zurück
     * 
     * @return BaseCommand[]
     */
    public function getCommands(): array
    {
        return [new AiMindLayerCommand()];
    }
}

/**
 * Befehl zum manuellen Aktualisieren der .ai.json
 */
class AiMindLayerCommand extends BaseCommand
{
    protected function configure(): void
    {
        $this->setName('aimindlayer:update')
            ->setDescription('Aktualisiert oder erstellt die .ai.json Datei');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $output->writeln('<info>Starte .ai.json Update...</info>');
        
        try {
            $plugin = new ComposerPlugin();
            
            try {
                // Wir versuchen erst die normale Composer-Integration
                $plugin->onPostUpdate(new \Composer\Script\Event(
                    'aimindlayer:update',
                    $this->getComposer(),
                    $this->getIO(),
                    true
                ));
                
                $output->writeln('<info>✅ .ai.json Update abgeschlossen!</info>');
                return 0; // Success
            } catch (\Throwable $innerEx) {
                // Fallback zum einfachen Modus
                $output->writeln('<comment>⚠️ Composer-Integration nicht verfügbar, verwende Fallback...</comment>');
                
                // Minimale Implementation direkt hier
                if (!file_exists('composer.json')) {
                    throw new \RuntimeException('Keine composer.json gefunden!');
                }
                
                $composerContent = file_get_contents('composer.json');
                $composerJson = json_decode($composerContent, true);
                
                if (json_last_error() !== JSON_ERROR_NONE) {
                    throw new \RuntimeException('composer.json enthält ungültiges JSON: ' . json_last_error_msg());
                }
                
                // .ai.json laden oder erstellen
                $aiContent = file_exists('.ai.json') ? file_get_contents('.ai.json') : '{}';
                $aiJson = json_decode($aiContent, true);
                
                if (json_last_error() !== JSON_ERROR_NONE) {
                    $aiJson = [
                        'project' => [],
                        'ai_context' => [],
                        'architecture' => ['components' => [], 'dependencies' => []],
                        'features' => []
                    ];
                }
                
                // Projektinformationen übernehmen
                if (isset($composerJson['name'])) {
                    $aiJson['project']['name'] = $composerJson['name'];
                }
                
                if (isset($composerJson['description'])) {
                    $aiJson['project']['description'] = $composerJson['description'];
                }
                
                // .ai.json speichern
                file_put_contents('.ai.json', json_encode($aiJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
                $output->writeln('<info>✅ .ai.json erfolgreich aktualisiert (Fallback)!</info>');
                return 0;
            }
        } catch (\Exception $e) {
            $output->writeln('<error>❌ Fehler: ' . $e->getMessage() . '</error>');
            return 1; // Error
        }
    }
}